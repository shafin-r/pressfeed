import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "react-native";
import React, { useEffect } from "react";

const RenderModal = ({
  expandedContent,
  showSourcesOnly,
  setExpandedContent,
  setShowSourcesOnly,
}) => {
  if (!expandedContent) return null;

  return (
    <ScrollView style={styles.expandedContentContainer}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setExpandedContent(null);
          setShowSourcesOnly(false);
        }}
      >
        <AntDesign name="close" size={24} color="#888" />
      </TouchableOpacity>

      <Text style={styles.expandedHeadline}>{expandedContent.headline}</Text>

      <View style={styles.genreContainer}>
        <View style={styles.expandedGenre}>
          <Text style={styles.expandedGenreText}>{expandedContent.genre}</Text>
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
                {(showSourcesOnly || !showSourcesOnly) && source.headline && (
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

export default RenderModal;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    fontFamily: "Segoe-Bold",
    fontSize: 12,
  },
  genre: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#e9f5ff",
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  headline: {
    fontFamily: "Segoe-Bold",
    fontSize: 22,
    marginVertical: 10,
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
    fontFamily: "Segoe-Bold",
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
    fontFamily: "Segoe-Bold",
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
    fontFamily: "Segoe",
    lineHeight: 24,
    color: "#333",
  },
  expandedSources: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  expandedSourceTitle: {
    fontFamily: "Segoe-Bold",
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
    fontFamily: "Segoe-Bold",
    fontSize: 14,
    color: "#333",
  },
  sourceHeadline: {
    fontFamily: "Segoe",
    fontSize: 13,
    fontStyle: "italic",
    color: "#444",
    marginTop: 3,
  },
});
