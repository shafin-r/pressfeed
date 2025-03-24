// App.js
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { dummyData } from "@/utils/dummy-data";
import RenderCard from "@/components/RenderCard";
import { styling } from "@/utils/styling";
import RenderModal from "@/components/RenderModal";

// Mock news data

export default function App() {
  const [fontsLoaded] = useFonts({
    Segoe: require("@/assets/fonts/segoe-ui.ttf"),
    "Segoe-Bold": require("@/assets/fonts/segoe-ui-bold.ttf"),
  });
  const { width, height } = Dimensions.get("window");

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(currentIndex); // 1️⃣ Create a ref

  const [lastSkippedIndex, setLastSkippedIndex] = useState(-1);
  const [savedItems, setSavedItems] = useState([]);
  const position = useState(new Animated.ValueXY())[0];
  const [newsData, setNewsData] = useState(dummyData);
  const [expandedContent, setExpandedContent] = useState(null);
  const [showSourcesOnly, setShowSourcesOnly] = useState(false);
  const [history, setHistory] = useState([]);

  const panResponder = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          swipeRight();
        } else if (gesture.dx < -120) {
          swipeLeft();
        } else if (gesture.dy < -80) {
          swipeUp();
        } else {
          resetPosition();
        }
      },
    })
  )[0];

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: true, // Change to true to be consistent
    }).start();
  };

  // Fix swipeUp to handle animations and state changes properly
  const swipeUp = () => {
    if (!newsData.length || currentIndexRef.current >= newsData.length) {
      console.log("No news data available for swipe up!");
      return;
    }

    const selectedNews = newsData[currentIndexRef.current]; // 3️⃣ Use the ref value

    Animated.timing(position, {
      toValue: { x: 0, y: -height },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setExpandedContent(selectedNews); // ✅ Uses the correct news item now!
      setShowSourcesOnly(true);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipeLeft = () => {
    if (currentIndex >= newsData.length - 1) return;

    setHistory((prevHistory) => [...prevHistory, currentIndex]); // Track previous index

    Animated.timing(position, {
      toValue: { x: -500, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipeRight = () => {
    if (currentIndex >= newsData.length - 1) return;

    setHistory((prevHistory) => [...prevHistory, currentIndex]); // Track previous index
    const selectedNews = newsData[currentIndex];

    setExpandedContent(selectedNews); // ✅ Set modal content before updating index
    setShowSourcesOnly(false);

    Animated.timing(position, {
      toValue: { x: 500, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSavedItems((prevSaved) => [...prevSaved, selectedNews]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const goBack = () => {
    if (history.length === 0) return; // No history to go back to

    const lastIndex = history.pop(); // Get last swiped index and remove it from history
    setCurrentIndex(lastIndex); // Restore last swiped card
    setHistory([]); // Restore correct index

    Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.logo}>Pressfeed</Text>
          <View>
            <TouchableOpacity onPress={() => setCurrentIndex(0)}>
              <Text>Reset App</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.swipeContainer}>
          <Text style={{ fontSize: 24 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.logo}>Pressfeed</Text>
        <View>
          <TouchableOpacity onPress={() => setCurrentIndex(0)}>
            <Text>Reset App</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.swipeContainer}>
        <RenderCard
          newsData={newsData}
          currentIndex={currentIndex}
          panResponder={panResponder}
          position={position}
        />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            history.length === 0 ? styles.disabledButton : null,
          ]}
          onPress={goBack}
          disabled={history.length === 0} // ✅ Disable after one step back
        >
          <Ionicons
            name="return-down-back"
            size={30}
            color={history.length === 0 ? "#ccc" : "#0077cc"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            currentIndex >= newsData.length ? styles.disabledButton : null,
          ]}
          onPress={swipeLeft}
          disabled={currentIndex >= newsData.length}
        >
          <Ionicons
            name="close"
            size={35}
            color={currentIndex >= newsData.length ? "#ccc" : "#FF3B30"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            currentIndex >= newsData.length - 1 ? styles.disabledButton : null,
          ]}
          onPress={swipeRight}
          disabled={currentIndex >= newsData.length - 1} // ✅ Fix this condition
        >
          <Ionicons
            name="arrow-forward"
            size={25}
            color={currentIndex >= newsData.length - 1 ? "#ccc" : "green"}
          />
        </TouchableOpacity>
      </View>

      {expandedContent && (
        <View style={styles.modalOverlay}>
          <RenderModal
            expandedContent={expandedContent}
            setExpandedContent={setExpandedContent}
            showSourcesOnly={showSourcesOnly}
            setShowSourcesOnly={setShowSourcesOnly}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create(styling);
