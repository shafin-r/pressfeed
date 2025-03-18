export const styling = {
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
    fontFamily: "SegoeUI-Bold",
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
    fontFamily: "SegoeUI-Bold",
    fontSize: 22,
    marginVertical: 10,
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
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 20,
  },
};
