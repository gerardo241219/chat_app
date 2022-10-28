import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { TextInput } from 'react-native-paper';
import sendImage from './../assets/send.png';
import attachmentImage from './../assets/clip.png'
import io from 'socket.io-client'; import AsyncStorage from '@react-native-async-storage/async-storage';
;

const Chat = ({ navigation, route }) => {

    // Socket
    const socket = io('http://192.168.1.76:3000');

    // Chat's states
    const [message, setMessage] = useState(''); // Store Text Message
    const [typeMessage, setTypeMessage] = useState(''); // Store Text Message
    const [messagesList, setMessagesList] = useState([]); // Sotre messages

    // AsyncStorage's states
    const [idUser, setIdUser] = useState('');
    const [idSucursal, setIdSucursal] = useState('');
    const [idLead, setIdLead] = useState('');

    // Effects
    useEffect(() => {
        getData();
        resetData();
    }, []);

    // Functions
    const sendMessage = () => { //Function Send Message
        if (message != "") {
            setTypeMessage("chat");
            socket.emit('chat sendMessage', idUser, idSucursal, idLead, message, typeMessage);
            resetData();
        }
    }

    const getMessages = () => {
        setInterval(() => {
            alert("Hola");
        }, 1000);
    }

    const resetData = () => { // Function reset data
        setMessage('');
        setTypeMessage('');
    }

    const getData = async () => { // Function to Get Data to send Message
        setIdUser(await AsyncStorage.getItem('@sesion_usuario_id'));
        setIdSucursal(await AsyncStorage.getItem('@sesion_sucursal_id'));
        setIdLead(route.params.lead[0]);
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat con: {route.params.lead[1]}</Text>
            </View>

            {/* Messages List */}
            <View style={styles.messagesContainer}>
                <FlatList style={styles.messagesList}

                />
            </View>

            {/* Message Container */}
            <View style={styles.messageZone}>
                {/* Input Message */}
                <View style={styles.messageInput}>
                    <TextInput
                        multiline
                        placeholder='Add message'
                        style={styles.messageTextInput}
                        value={message}
                        onChangeText={(e) => setMessage(e)}
                    />
                </View>
                {/* Buttons Container */}
                <View style={styles.messageButtons}>
                    {/* Attachement Button */}
                    <View style={styles.btnAttached}>
                        <TouchableOpacity>
                            <Image
                                source={attachmentImage}
                                style={styles.btnsImages}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* Send Button */}
                    <View style={styles.btnSend}>
                        <TouchableOpacity
                            onPress={sendMessage}>
                            <Image
                                source={sendImage}
                                style={styles.btnsImages}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        width: 350,
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        marginTop: 10,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: 'white'
    },
    messagesContainer: {
        width: 350,
        height: 585,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        padding: 5,
        marginTop: 10,
    },
    messageZone: {
        width: 350,
        position: 'absolute',
        padding: 5,
        bottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageInput: {
        width: 220,
        marginRight: 10
    },
    messageTextInput: {
        backgroundColor: '#F0F0F0',
        borderRadius: 5
    },
    messageButtons: {
        width: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    btnAttached: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: 'red',
    },
    btnSend: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: 'red',
    },
    btnsImages: {
        width: 15,
        height: 15,
        marginLeft: 17,
        marginTop: 16
    }
});

export default Chat