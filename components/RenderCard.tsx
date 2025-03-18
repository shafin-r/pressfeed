import { View, Text, Dimensions } from "react-native";
import React, { useRef, useState } from "react";
import { Image, Animated, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

const RenderCard = ({ currentIndex, newsData, panResponder, position }) => {
  const rotation = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-30deg", "0deg", "30deg"],
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

export default RenderCard;

const styles = StyleSheet.create({
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
});
