import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import iconUser from './../assets/iconUser.png';
import iconMessage from './../assets/messagesIcon.png';
import { alertInfo } from './../alerts.js';

import io from 'socket.io-client';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {

    const socket = io('http://192.168.1.85:3000');

    const [usuario_id, set_usuario_id] = useState("");
    const [leads, setLeads] = useState([]);

    const getData = async () => {
        set_usuario_id(await AsyncStorage.getItem('@sesion_usuario_id'));
    }

    getData();

    useEffect(() => {
        if(usuario_id != "") {
            socket.on('connect', () => {
                setInterval(() => {
                    socket.emit('chat message', usuario_id);
                },1000);
            })
        }
    }, [usuario_id]);

    socket.on('respuesta nuevosLeads', data => {
        setLeads(data);
    });

    const handleChat = (id, nombre) => {
        alertInfo('Importante', 'Antes de continuar recuerda que debes comenzar tu conversación con una plantilla.')
        navigation.navigate('Chat', { lead: [id, nombre] });
    }  

    return (
        <View style={styles.container}>
            <FlatList style={styles.lista}
                data={leads}
                renderItem={({ item }) =>
                    <TouchableOpacity 
                        style={styles.containerList}
                        onPress={() => handleChat(item.lead_id, item.lead_nombre)}>
                        <Image source={iconUser} style={styles.iconUser} />
                        <View style={styles.containerDescription}>
                            <Text style={styles.item}>{item.lead_nombre}</Text>
                            <Text style={styles.itemInfo}>{item.lead_correo}</Text>
                            <Text style={styles.itemInfo}>{item.lead_telefono}</Text>
                        </View>
                    </TouchableOpacity>
                }
            />
            <TouchableOpacity
                style={styles.btnFloat}
                onPress={() => navigation.navigate('Chats')}
            >
                <Image source={iconMessage} style={styles.iconMessage} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lista: {
        marginTop: 20,
    },
    containerList: {
        flexDirection: 'row',
        alignContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginTop: 10,
    },
    containerDescription: {
        marginLeft: 5
    },
    item: {
        fontSize: 18,
        height: 25,
        color: '#64748b',
    },
    itemInfo: {
        fontSize: 13,
    },
    iconUser: {
        width: 50,
        height: 50,
        marginTop: 5
    },
    btnFloat: {
        position: 'absolute',
        width: 60,
        height: 60,
        backgroundColor: '#f4511e',
        borderRadius: 100,
        bottom: 20,
        right: 20,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    },
    iconMessage: {
        width: 20,
        height: 20,
        alignSelf: 'center',
    }
});

export default Home