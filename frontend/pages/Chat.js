import { Modal, FlatList, View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { alertInfo } from './../alerts.js';
import iconSend from './../assets/send.png';
import iconClip from './../assets/clip.png';
import iconPlantilla from './../assets/plantilla.png';
import iconImagen from './../assets/imagenes.png';
import iconArchivo from './../assets/archivo.png';
import io from 'socket.io-client';

const Chat = ({ navigation, route }) => {

    const socket = io('http://192.168.1.76:3000');
    const flatList = useRef(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [listMessages, setListMessages] = useState([]);

    const sendMessage = () => {
        alert(message);
        setMessage("");
    }

    const showModal = () => {
        setModalVisible(true);
    }

    useEffect(() => {
        if (route.params.lead[0] > 0) {
            socket.on('connect', () => {
                setInterval(() => {
                    socket.emit("chat listMessages", route.params.lead[0]);
                }, 1000);
            });
        }
    }, []);

    socket.on('respuesta listMessages', data => {
        setListMessages(data);
    });

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={iconPlantilla}
                            style={styles.iconPlantilla}
                        />
                        <Text style={styles.iconInfo}>Plantillas</Text>
                    </View>

                    <View style={styles.iconContainer}>
                        <Image
                            source={iconImagen}
                            style={styles.iconPlantilla}
                        />
                        <Text style={styles.iconInfo}>Imagenes</Text>
                    </View>

                    <View style={styles.iconContainer}>
                        <Image
                            source={iconArchivo}
                            style={styles.iconPlantilla}
                        />
                        <Text style={styles.iconInfo}>Archivos</Text>
                    </View>
                </View>
            </Modal>
            <View style={styles.messages}>
                <Text style={styles.leadName}>Chat con: {route.params.lead[1]} </Text>
            </View>
            <View style={styles.listMessages}>
                <FlatList
                    style={styles.list}
                    data={listMessages}
                    ref={flatList}
                    onContentSizeChange={() => flatList.current.scrollToEnd()}
                    renderItem={({ item }) =>
                        <TouchableOpacity>
                            <View style={item.mensaje_usuario == "Asesor" ? styles.messageAsesor : styles.messagesLeads}>
                                <Text style={styles.item}>{item.mensaje_cuerpo}</Text>
                                <Text style={styles.itemInfo}>{item.mensaje_tipo}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                />
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
                    onPress={showModal}>
                    <Image
                        source={iconClip}
                        style={styles.sendIcon}
                    />
                </TouchableOpacity>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)'
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
    listMessages: {
        height: 580,
        display: 'flex'
    },
    inputMessage: {
        width: 220,
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
    },
    messageAsesor: {
        width: 250,
        backgroundColor: '#DFDFDF',
        padding: 10,
        marginTop: 5,
        borderRadius: 20,
        borderTopRightRadius: 0,
        marginLeft: 100
    },
    messagesLeads: {
        width: 250,
        backgroundColor: '#F5F5F5',
        padding: 10,
        marginTop: 5,
        borderRadius: 20,
        borderTopLeftRadius: 0,
    },
    iconContainer: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginBottom: 5
    },  
    iconPlantilla: {
        width: 100,
        height: 100
    },
    iconInfo: {
        textAlign: 'center',
        marginTop: 10
    }
});

export default Chat