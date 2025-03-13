import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

export default function Index() {
  const [newsData, setNewsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSkippedIndex, setLastSkippedIndex] = useState(-1);
  const [expandedContent, setExpandedContent] = useState(null);
  const [showSourcesOnly, setShowSourcesOnly] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fontsLoaded] = useFonts({
    SegoeUI: require("@/assets/fonts/segoe-ui.ttf"),
    "SegoeUI-Bold": require("@/assets/fonts/segoe-ui-bold.ttf"),
  });

  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  // Indicators opacity
  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const upSwipeOpacity = position.y.interpolate({
    inputRange: [-height / 6, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const swipeLeft = () => {
    setIsAnimating(true);
    Animated.timing(position, {
      toValue: { x: -width * 1.5, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setLastSkippedIndex(currentIndex);
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
      setIsAnimating(false);
    });
  };

  // Swipe right (like)
  const swipeRight = () => {
    setIsAnimating(true);
    Animated.timing(position, {
      toValue: { x: width * 1.5, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      const news = newsData[currentIndex];
      setExpandedContent(news);
      setShowSourcesOnly(false);
      setLastSkippedIndex(currentIndex);
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
      setIsAnimating(false);
    });
  };

  // Swipe up (show sources)
  const swipeUp = () => {
    setIsAnimating(true);
    Animated.timing(position, {
      toValue: { x: 0, y: -height },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      const news = newsData[currentIndex];
      setExpandedContent(news);
      setShowSourcesOnly(true);
      position.setValue({ x: 0, y: 0 });
      setIsAnimating(false);
    });
  };

  // Go back to previous card
  const goBack = () => {
    if (lastSkippedIndex === -1 || isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex(lastSkippedIndex);
    setLastSkippedIndex(-1);

    // Animation effect for returning card
    Animated.sequence([
      Animated.timing(position, {
        toValue: { x: -width * 1.5, y: 0 },
        duration: 0,
        useNativeDriver: false,
      }),
      Animated.timing(position, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  // Pan responder for handling swipes
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5;
      },
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
      },
      onPanResponderMove: (_, gestureState) => {
        if (isAnimating) return;
        const { dx, dy } = gestureState;

        // Determine if movement is more horizontal or vertical
        const isHorizontal = Math.abs(dx) > Math.abs(dy);

        if (isHorizontal) {
          position.setValue({ x: dx, y: 0 });
        } else if (dy < 0) {
          // Only allow upward swipes
          position.setValue({ x: 0, y: dy });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isAnimating) return;

        position.flattenOffset();
        const { dx, dy } = gestureState;
        const isHorizontal = Math.abs(dx) > Math.abs(dy);

        if (isHorizontal) {
          if (dx < -SWIPE_THRESHOLD) {
            swipeLeft();
          } else if (dx > SWIPE_THRESHOLD) {
            swipeRight();
          } else {
            resetPosition();
          }
        } else if (dy < -SWIPE_THRESHOLD) {
          swipeUp();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Fetch data - in a real app, replace with actual API call
    const demoData = [
      {
        id: 1,
        headline: "Supreme Court Rules on Major Privacy Case",
        genre: "Politics",
        image: "https://picsum.photos/id/1018/800/450",
        time: "2 hours ago",
        details:
          "In a landmark decision, the Supreme Cour ruled 6-3 that law enforcement agencies must obtain a warrant before accessing cell phone location data. This ruling has significant implications for digital privacy rights and sets a precedent for future cases involving personal data.",
        tags: { exclusive: true, promoted: false },
        sources: [
          {
            name: "Washington Post",
            icon: "https://picsum.photos/id/1/20/20",
            time: "2 hours ago",
            headline: "Supreme Court Sides with Digital Privacy Advocates",
          },
          {
            name: "CNN",
            icon: "https://picsum.photos/id/2/20/20",
            time: "2.5 hours ago",
          },
          {
            name: "Fox News",
            icon: "https://picsum.photos/id/3/20/20",
            time: "3 hours ago",
            headline: "Court Ruling Limits Police Powers",
          },
          {
            name: "NBC News",
            icon: "https://picsum.photos/id/4/20/20",
            time: "3.5 hours ago",
          },
        ],
      },
      {
        id: 2,
        headline:
          "Scientists Discover Potential New Antibiotics in Soil Bacteria",
        genre: "Science",
        image: "https://picsum.photos/id/287/800/450",
        time: "5 hours ago",
        details:
          "Researchers at MIT have identified a promising new class of antibiotics in soil bacteria that could help combat the growing problem of antibiotic resistance. The discovery involves a novel screening method that has revealed compounds effective against drug-resistant pathogens.",
        tags: { exclusive: false, promoted: false },
        sources: [
          {
            name: "New Scientist",
            icon: "https://picsum.photos/id/5/20/20",
            time: "5 hours ago",
          },
          {
            name: "Science Daily",
            icon: "https://picsum.photos/id/6/20/20",
            time: "5.5 hours ago",
            headline: "Novel Antibiotic Compounds Found in Soil",
          },
          {
            name: "Nature",
            icon: "https://picsum.photos/id/7/20/20",
            time: "6 hours ago",
          },
        ],
      },
      {
        id: 3,
        headline: "Tech Giant Unveils Revolutionary AI Assistant",
        genre: "Technology",
        image: "https://picsum.photos/id/96/800/450",
        time: "1 day ago",
        details:
          "A leading technology company has announced a breakthrough in artificial intelligence with their new AI assistant that can understand and respond to complex requests with human-like understanding. The system leverages a new neural network architecture that significantly improves contextual comprehension.",
        tags: { exclusive: false, promoted: true },
        sources: [
          {
            name: "TechCrunch",
            icon: "https://picsum.photos/id/8/20/20",
            time: "1 day ago",
          },
          {
            name: "Wired",
            icon: "https://picsum.photos/id/9/20/20",
            time: "1 day ago",
            headline: "Next-Gen AI Assistant Rivals Human Understanding",
          },
          {
            name: "The Verge",
            icon: "https://picsum.photos/id/10/20/20",
            time: "1.2 days ago",
          },
        ],
      },
    ];

    setNewsData(demoData);
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render card component
  const renderCard = () => {
    if (currentIndex >= newsData.length) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>No more news!</Text>
          <Text style={styles.noMoreCardsSubtext}>
            Check back later for updates
          </Text>
        </View>
      );
    }

    const news = newsData[currentIndex];

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate: rotation },
            ],
          },
        ]}
      >
        {/* Card Image */}
        <View style={styles.cardImage}>
          <Image source={{ uri: news.image }} style={styles.image} />

          {/* Special Tags */}
          <View style={styles.tagContainer}>
            {news.tags.exclusive && (
              <View style={[styles.specialTag, styles.exclusiveTag]}>
                <Text style={styles.tagText}>EXCLUSIVE</Text>
              </View>
            )}
            {news.tags.promoted && (
              <View
                style={[
                  styles.specialTag,
                  styles.promotedTag,
                  news.tags.exclusive && { marginLeft: 10 },
                ]}
              >
                <Text style={styles.tagText}>PROMOTED</Text>
              </View>
            )}
          </View>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          <View style={styles.genre}>
            <Text style={styles.genreText}>{news.genre}</Text>
          </View>

          <Text style={styles.headline}>{news.headline}</Text>

          <View style={styles.source}>
            <Image
              source={{ uri: news.sources[0].icon }}
              style={styles.sourceIcon}
            />
            <Text style={styles.sourceText}>
              {news.sources[0].name}
              {news.sources.length > 1 && `, ${news.sources[1].name}`}
              {news.sources.length > 2 && `, ${news.sources[2].name}`}
              {news.sources.length > 3 && ` +${news.sources.length - 3} more`}
            </Text>
          </View>

          <Text style={styles.time}>{news.time}</Text>
        </View>

        {/* Swipe Indicators */}
        <Animated.View
          style={[
            styles.swipeIndicator,
            styles.leftIndicator,
            { opacity: dislikeOpacity },
          ]}
        >
          <Text style={styles.indicatorText}>✕</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.swipeIndicator,
            styles.rightIndicator,
            { opacity: likeOpacity },
          ]}
        >
          <Text style={styles.indicatorText}>→</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.swipeIndicator,
            styles.upIndicator,
            { opacity: upSwipeOpacity },
          ]}
        >
          <Text style={styles.indicatorText}>⤴</Text>
        </Animated.View>
      </Animated.View>
    );
  };

  // Render expanded content (article or sources)
  const renderExpandedContent = () => {
    if (!expandedContent) return null;

    return (
      <ScrollView style={styles.expandedContentContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setExpandedContent(null)}
        >
          <AntDesign name="close" size={24} color="#888" />
        </TouchableOpacity>

        <Text style={styles.expandedHeadline}>{expandedContent.headline}</Text>

        <View style={styles.genreContainer}>
          <View style={styles.expandedGenre}>
            <Text style={styles.expandedGenreText}>
              {expandedContent.genre}
            </Text>
          </View>

          <View style={styles.expandedSpecialTags}>
            {expandedContent.tags.exclusive && (
              <View style={[styles.specialTag, styles.exclusiveTag]}>
                <Text style={styles.tagText}>EXCLUSIVE</Text>
              </View>
            )}
            {expandedContent.tags.promoted && (
              <View style={[styles.specialTag, styles.promotedTag]}>
                <Text style={styles.tagText}>PROMOTED</Text>
              </View>
            )}
          </View>
        </View>

        <Image
          source={{ uri: expandedContent.image }}
          style={styles.expandedImage}
        />

        {!showSourcesOnly && (
          <Text style={styles.expandedDetails}>{expandedContent.details}</Text>
        )}

        <View style={styles.expandedSources}>
          <Text style={styles.expandedSourceTitle}>
            {showSourcesOnly
              ? "All Sources and Headlines:"
              : "Sources Reporting This:"}
          </Text>

          <View style={styles.sourceList}>
            {expandedContent.sources.map((source, idx) => (
              <View key={idx} style={styles.sourceItem}>
                <Image
                  source={{ uri: source.icon }}
                  style={styles.sourceListIcon}
                />
                <View style={styles.sourceItemContent}>
                  <Text style={styles.sourceItemTitle}>
                    {source.name} • {source.time}
                  </Text>
                  {showSourcesOnly && source.headline && (
                    <Text style={styles.sourceHeadline}>{source.headline}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>PressFeed</Text>
      </View>

      {/* Card Container */}
      <View style={styles.swipeContainer}>{renderCard()}</View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.backButton,
            lastSkippedIndex === -1 && styles.disabledButton,
          ]}
          onPress={goBack}
          disabled={lastSkippedIndex === -1}
        >
          <AntDesign
            name="back"
            size={24}
            color={lastSkippedIndex === -1 ? "#ccc" : "#3498db"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={swipeLeft}
          disabled={currentIndex >= newsData.length || isAnimating}
        >
          <AntDesign name="close" size={24} color="#fc5c65" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={swipeRight}
          disabled={currentIndex >= newsData.length || isAnimating}
        >
          <AntDesign name="arrowright" size={24} color="#26de81" />
        </TouchableOpacity>
      </View>

      {/* Expanded Content Modal */}
      {expandedContent && (
        <View style={styles.modalOverlay}>{renderExpandedContent()}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: "center",
    zIndex: 10,
  },
  logo: {
    fontSize: 24,
    fontFamily: "SegoeUI-Bold",
    color: "#ff3e5e",
  },
  swipeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    position: "absolute",
    width: width - 40,
    height: height * 0.6,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  cardImage: {
    height: "60%",
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tagContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
  },
  specialTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  exclusiveTag: {
    backgroundColor: "#ff3e5e",
  },
  promotedTag: {
    backgroundColor: "#3498db",
  },
  tagText: {
    color: "white",
    fontFamily: "SegoeUI-Bold",
    fontSize: 12,
  },
  cardContent: {
    padding: 20,
    height: "40%",
    justifyContent: "space-between",
  },
  genre: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#e9f5ff",
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  genreText: {
    color: "#0077cc",
    fontFamily: "SegoeUI-Bold",
    fontSize: 12,
  },
  headline: {
    fontFamily: "SegoeUI-Bold",
    fontSize: 22,
    marginVertical: 10,
  },
  source: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  sourceText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "SegoeUI",
  },
  time: {
    color: "#888",
    fontSize: 14,
    fontFamily: "SegoeUI",
    marginTop: 10,
  },
  swipeIndicator: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  leftIndicator: {
    backgroundColor: "rgba(252, 92, 101, 0.2)",
  },
  rightIndicator: {
    backgroundColor: "rgba(38, 222, 129, 0.2)",
  },
  upIndicator: {
    backgroundColor: "rgba(128, 128, 255, 0.2)",
  },
  indicatorText: {
    fontSize: 32,
    fontFamily: "SegoeUI-Bold",
    color: "#fff",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: "#f5f5f5",
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  backButton: {
    backgroundColor: "#f0f8ff",
  },
  dislikeButton: {
    backgroundColor: "#fff0f0",
  },
  likeButton: {
    backgroundColor: "#f0fff5",
  },
  disabledButton: {
    backgroundColor: "#f5f5f5",
  },
  noMoreCards: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noMoreCardsText: {
    fontSize: 22,
    fontFamily: "SegoeUI-Bold",
    color: "#888",
    marginBottom: 10,
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    fontFamily: "SegoeUI",
    color: "#aaa",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 20,
  },
  expandedContentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 30,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 30,
  },
  expandedHeadline: {
    fontSize: 24,
    fontFamily: "SegoeUI-Bold",
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingRight: 50,
  },
  genreContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  expandedGenre: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#e9f5ff",
    borderRadius: 20,
    marginRight: 10,
  },
  expandedGenreText: {
    color: "#0077cc",
    fontFamily: "SegoeUI-Bold",
    fontSize: 14,
  },
  expandedSpecialTags: {
    flexDirection: "row",
  },
  expandedImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  expandedDetails: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: "SegoeUI",
    lineHeight: 24,
    color: "#333",
  },
  expandedSources: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  expandedSourceTitle: {
    fontFamily: "SegoeUI-Bold",
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  sourceList: {
    maxHeight: 300,
  },
  sourceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#ddd",
  },
  sourceListIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  sourceItemContent: {
    flex: 1,
  },
  sourceItemTitle: {
    fontFamily: "SegoeUI-Bold",
    fontSize: 14,
    color: "#333",
  },
  sourceHeadline: {
    fontFamily: "SegoeUI",
    fontSize: 13,
    fontStyle: "italic",
    color: "#444",
    marginTop: 3,
  },
});
