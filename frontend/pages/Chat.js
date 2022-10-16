import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { alertInfo } from './../alerts.js';
import iconSend from './../assets/send.png';

const Chat = ({ navigation, route }) => {

    const [message, setMessage] = useState("");

    const sendMessage = () => {
        setMessage("");
    }

    return (
        <View style={styles.container}>
            <View style={styles.messages}>
                <Text style={styles.leadName}>Chat con: {route.params.lead[1]} </Text>
            </View>
            <View style={styles.sendMessage}>
                <TextInput
                    multiline
                    placeholder='Add message'
                    style={styles.inputMessage}
                    value={message}
                    onChangeText={e => setMessage(e)}
                />
                <TouchableOpacity
                    style={styles.btnSend} 
                    onPress={sendMessage}>
                    <Image
                        source={iconSend}
                        style={styles.sendIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    leadName: {
        width: 350,
        padding: 10,
        backgroundColor: 'rgba(244, 81, 30, 0.5)',
        marginTop: 10,
        textAlign: 'center',
        color: 'white',
        borderRadius: 5
    },
    sendMessage: {
        position: 'absolute',
        bottom: 20,
        width: 350,
        borderRadius: 5,
        backgroundColor: '#e1e1e1',
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'baseline',
    },
    inputMessage: {
        width: 270,
        maxWidth: 270,
        padding: 10,
        backgroundColor: 'white',
        display: 'flex',
        flexWrap: 'wrap',
        borderRadius: 5,
    },
    btnSend: {
        width: 50,
        height: 35,
        borderRadius: 100,
        backgroundColor: '#f4511e',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        left: 10,
        top: 7
    },
    sendIcon: {
        width: 20,
        height: 20,
        left: 14
    }
});

export default Chat