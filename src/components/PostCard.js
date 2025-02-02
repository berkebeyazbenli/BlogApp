import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    FlatList,
    TextInput
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const {height} = Dimensions.get("window");
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from "../constants/colors";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

const PostCard = ({id, username, imageUrl, likes, comments, caption}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const translateY = useRef(new Animated.Value(height)).current;
    const toggleModal = () => {
        setModalVisible(!modalVisible);
        Animated.timing(translateY, {
            toValue: modalVisible ? height : 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        loadLikeStatus();
    }, []);

    const loadLikeStatus = async () => {
        try {
            const liked = await AsyncStorage.getItem(`post_${id}_liked`);
            if (liked !== null) {
                setIsLiked(JSON.parse(liked));
            }
        } catch (error) {
            console.error('Error loading like status:', error);
        }
    };

    const handleLikeButtonPress = async () => {
        try {
            setIsLiked(prevState => !prevState);
            await AsyncStorage.setItem(`post_${id}_liked`, JSON.stringify(!isLiked));
        } catch (error) {
            console.error('Error saving like status:', error);
        }
    };

    const ModalItem = React.memo(({ title, index }) => (
        <TouchableOpacity
            style={[
                styles.item,
                {
                    marginBottom: index === listData1.length - 1 ? 0 : hp(2),
                    borderBottomWidth: index === listData1.length - 1 ? 0 : 1,
                },
            ]}
        >
            <Image
                source={require("../assets/monkey.jpg")}
                style={styles.itemImage}
            />
            <View style={styles.listContent}>
                <Text style={styles.title}>{title.substring(0, hp(10))}...</Text>
            </View>
        </TouchableOpacity>
    ));

    const listData1 = [
        {
            id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
            name: "Kaan",
            title:
                "🎉 Exciting News! 🚀 We are thrilled to announce a groundbreaking partnership that will redefine innovation in our community. Stay tuned for upcoming events, exclusive opportunities, and a wave of positive change. Together, we're shaping the future! 🌟 #InnovationUnleashed #StayTuned",
        },
        {
            id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
            name: "Kaan",
            title: "Second Item",
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            name: "Kaan",
            title: "Third Item",
        },
        {
            id: "1",
            name: "Kaan",
            title: "Third Item",
        },
        {
            id: "5",
            name: "Kaan",
            title: "Third Item",
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <View style={styles.header}>
                    <Text style={styles.username}>{username}</Text>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.caption}>{caption}</Text>
                    <View style={styles.likesAndCaptions}>
                        <TouchableOpacity
                            style={styles.likeButton}
                            onPress={handleLikeButtonPress}
                        >
                            <Icon
                                name={isLiked ? "heart" : "heart-outline"}
                                size={20}
                                color={isLiked ? "red" : COLORS.blue}
                            />
                            <Text style={[styles.likes, {color: isLiked ? "red" : COLORS.blue}]}>
                                {likes} likes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.commentButton}
                            onPress={toggleModal}
                        >
                            <Icon name={"chatbox-ellipses-outline"} size={20}/>
                            <Text style={styles.comments}>{comments} comments</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.imageContainer}>
                <Image source={{uri: imageUrl}} style={styles.image}/>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    toggleModal();
                }}
            >
                <Animatable.View
                    style={[styles.modalContainer, {transform: [{translateY}]}]}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            marginTop: 10,
                            color: "white",
                        }}
                    >
                        Comments
                    </Text>
                    <TouchableOpacity
                        style={styles.closeButtonModal}
                        onPress={toggleModal}
                    >
                        <Icon name="close-outline" size={wp(7)} color={COLORS.white}/>
                    </TouchableOpacity>
                    <View>
                        <FlatList
                            data={listData1}
                            renderItem={({item, index}) => (
                                <ModalItem title={item.title} index={index}/>
                            )}
                            keyExtractor={(item) => item.id}
                            style={styles.announcementBiggerListStyle}
                        />
                        <View style={styles.inputArea}>
                            <TextInput
                                style={styles.input}
                                placeholder="Share some ideas..."
                                placeholderTextColor={'#fff'}
                                multiline={true}
                            />
                            <TouchableOpacity style={styles.iconContainer}>
                                <Icon name={'git-branch'} size={35} style={styles.inputIcon}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animatable.View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        margin: 10,
        display: "flex",
        flexDirection: "row",
        width: wp(92),
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.white,
        padding: 5,
        backgroundColor: COLORS.white,
        shadowColor: "#fff",
        shadowOffset: {
            width: 8,
            height: hp(1),
        },
        shadowOpacity: 0.3,
        shadowRadius: wp(0.5),
        elevation: 5,
    },
    leftContainer: {
        flexDirection: 'column',
        width: wp(55),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    username: {
        fontWeight: 'bold',
        color: COLORS.blue,
        marginRight: 5,
        marginLeft: -5
    },
    imageContainer: {
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    image: {
        width: wp(12),
        height: hp(12),
        aspectRatio: 1,
        borderRadius: 10,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    likeButton: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 10
    },
    likes: {
        fontWeight: 'bold',
        marginLeft: 5
    },
    commentButton: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    caption: {
        marginBottom: 5,
        marginLeft: -5
    },
    likesAndCaptions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginLeft: -5
    },
    comments: {
        color: '#888',
        marginLeft: 5
    },
    modalContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#222831",
        padding: 20,
        height: height * 0.6,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderWidth: 2,
        borderBottomWidth: 0,
        borderColor: COLORS.white,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp(2),
        paddingBottom: hp(1),
        borderRadius: 16,
        backgroundColor: "white",
        borderColor: "white",
        borderWidth: wp(0.2),
    },
    closeButtonModal: {
        alignSelf: "flex-end",
        padding: wp(2),
        marginTop: -hp(4),
    },
    itemImage: {
        width: wp(10),
        height: wp(10),
        marginRight: wp(2),
        borderRadius: wp(50),
        marginLeft: wp(4),
        marginTop: hp(1),
    },
    listContent: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: wp(50),
        padding: 10,
        justifyContent: "center",
    },
    iconTouchable: {
        position: "absolute",
        marginLeft: wp(45),
    },
    listIcon: {
        marginLeft: "auto",
        marginTop: hp(1),
    },
    announcementBiggerListStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: hp(1),
        },
        shadowOpacity: 0.1,
        shadowRadius: wp(4),
        elevation: 5,
        backgroundColor: "transparent",
        borderRadius: 20,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    input: {
        padding: 10,
        fontSize: 18,
        borderWidth: 2,
        borderRadius: 12,
        borderColor: '#fff',
        width: wp(72.5),
        color: '#fff',
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -hp(6),
        backgroundColor: "#222831",
        height: hp(7)
    },
    iconContainer: {
        backgroundColor: "#222831",
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginTop: -hp(6)
    },
    inputIcon: {
        color: COLORS.green,
    },
});

export default PostCard;
