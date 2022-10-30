import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';
import sendImage from './../assets/send.png';
import attachmentImage from './../assets/clip.png'
import plantillaImage from './../assets/plantilla.png'
import { alertInfo } from './../alerts.js';
import io from 'socket.io-client'; import AsyncStorage from '@react-native-async-storage/async-storage';
;

const Chat = ({ navigation, route }) => {

    // Socket
    const socket = io('http://192.168.1.85:3000');

    socket.on('respuesta sendCierre', data => {
        alertInfo('¡Proceso exitoso!', data);
    });

    // Chat's states
    const [message, setMessage] = useState(''); // Store Text Message
    const [typeMessage, setTypeMessage] = useState(''); // Store Text Message
    const [messagesList, setMessagesList] = useState([]); // Sotre messages
    const [modalAdjuntos, setModalAdjuntos] = useState(false); // Visible modal Images
    const [modalDocs, setModalDocs] = useState(false); // Visible modal Docs
    const [modalPlantillas, setModalPlantillas] = useState(false); // Visible modal Plantillas
    const [modalArchivos, setModalArchivos] = useState(false); // Visible modal Plantillas
    const [modalCierre, setModalCierre] = useState(false); // Visible modal Cierre
    const [plantillas, setPlantillas] = useState([]);
    const [modalCorreo, setModalCorreo] = useState(false); // Visible modal Plantillas
    const [radioButtonPlantilla, setradioButtonPlantilla] = useState('');
    const [radioButtonCierre, setradioButtonCierre] = useState('');
    const [image, setImage] = useState(null); // State to pickerImage

    // AsyncStorage's states
    const [idUser, setIdUser] = useState('');
    const [idSucursal, setIdSucursal] = useState('');
    const [idLead, setIdLead] = useState('');

    // Effects
    useEffect(() => {
        getData();
        resetData();

        socket.on('connect', () => {
            socket.emit('chat listPlantillas');
        });

        socket.on('respuesta listPlantillas', data => {
            setPlantillas(data);
        });
    }, []);

    // Functions
    const pickImage = async () => { // No permissions request is necessary for launching the image library

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const sendImageUpload = async () => { // Function to send Image and upload in the server
        let localUri = image;

        if (localUri == null || localUri == '') {
            alertInfo('Importante', 'Antes debes seleccionar una imagen');
        } else {
            let filename = localUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            const formData = new FormData();
            formData.append('image', { uri: localUri, name: filename, type });
            formData.append('lead', idLead);
            formData.append('user', idUser);

            const resp = await fetch('https://chatwa.gpoptima.info/api-sendImage', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => response.text())
                .then(data => {
                    return data.message;
                })
                .catch(function (error) {
                    return 'Esto es un error' + error.message;
                });

            setImage(null);
            setModalArchivos(false);
        }
    }

    const sendMessage = () => { //Function Send Message
        if (message != "") {
            setTypeMessage("chat");
            socket.emit('chat sendMessage', idUser, idSucursal, idLead, message, typeMessage);
            resetData();
        }
    }

    const sendPlantilla = () => {
        if (radioButtonPlantilla != "") {
            setTypeMessage("plantilla");
            socket.emit('chat sendPlantilla', idUser, idSucursal, idLead, radioButtonPlantilla, typeMessage);
            setradioButtonPlantilla('');
            setModalPlantillas(false);
        }
    }

    const sendEmail = () => {
        if (radioButtonPlantilla != "") {
            setTypeMessage("email");
            socket.emit('chat sendEmail', idUser, idSucursal, idLead, radioButtonPlantilla, typeMessage);
            setradioButtonPlantilla('');
            setModalCorreo(false);
        }
    }

    const sendCierre = () => {
        socket.emit('chat sendCierre', idUser, idLead, radioButtonCierre);
        setradioButtonCierre('');
        setModalCierre(false);
    }

    const getMessages = () => {
        setInterval(() => {
            alert("Hola");
        }, 1000);
    }

    const resetData = () => { // Function reset data
        setMessage('');
    }

    const getData = async () => { // Function to Get Data to send Message
        setIdUser(await AsyncStorage.getItem('@sesion_usuario_id'));
        setIdSucursal(await AsyncStorage.getItem('@sesion_sucursal_id'));
        setIdLead(route.params.lead[0]);
    }

    return (
        <View style={styles.container}>
            {/* Modal Adjuntos */}
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalAdjuntos}
                onRequestClose={() => {
                    setModalAdjuntos(!modalAdjuntos);
                }}
            >
                <View style={styles.modalAdjuntos}>
                    <View style={styles.adjuntos}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={styles.btnsModals}
                                onPress={() => {
                                    setModalPlantillas(true)
                                    setModalAdjuntos(false)
                                }}>
                                <Image
                                    source={plantillaImage}
                                    style={styles.imagesModal}
                                />
                                <Text style={styles.textBtn}>Plantillas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btnsModals}
                                onPress={() => {
                                    setModalCorreo(true)
                                    setModalAdjuntos(false)
                                }}>
                                <Image
                                    source={plantillaImage}
                                    style={styles.imagesModal}
                                />
                                <Text style={styles.textBtn}>Correos</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={styles.btnsModals}
                                onPress={() => {
                                    setModalArchivos(true)
                                    setModalAdjuntos(false)
                                }}>
                                <Image
                                    source={plantillaImage}
                                    style={styles.imagesModal}
                                />
                                <Text style={styles.textBtn}>Imagenes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btnsModals}
                                onPress={() => {
                                    setModalDocs(true)
                                    setModalAdjuntos(false)
                                }}>
                                <Image
                                    source={plantillaImage}
                                    style={styles.imagesModal}
                                />
                                <Text style={styles.textBtn}>Documentos</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={styles.btnsModals}
                                onPress={() => {
                                    setModalCierre(true)
                                    setModalAdjuntos(false)
                                }}>
                                <Image
                                    source={plantillaImage}
                                    style={styles.imagesModal}
                                />
                                <Text style={styles.textBtn}>Cierre</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

            {/* Modal Plantillas */}
            <Modal
                style={styles.modalContainer}
                animationType='fade'
                transparent={true}
                visible={modalPlantillas}
                onRequestClose={() => {
                    setModalPlantillas(!modalPlantillas);
                }}>
                <View style={styles.modalAdjuntos}>
                    <Text style={styles.titleSendPlantilla}>Escoge una plantilla</Text>
                    <FlatList style={styles.listaPlantillas}
                        data={plantillas}
                        renderItem={({ item }) =>
                            <View>
                                <View style={styles.btnPlantilla}>
                                    <RadioButton
                                        value={item.plantilla_id}
                                        label="Carto Base MAp"
                                        status={radioButtonPlantilla === item.plantilla_id ? 'checked' : 'unchecked'}
                                        onPress={() => { setradioButtonPlantilla(item.plantilla_id); }}
                                    />
                                    <View>
                                        <Text>{item.plantilla_encabezado}</Text>
                                        <Text style={styles.cuerpoPlantilla}>{item.plantilla_cuerpo}</Text>
                                    </View>
                                </View>
                            </View>
                        }
                    />
                    <TouchableOpacity
                        style={styles.btnSendPlantilla}
                        onPress={() => sendPlantilla()}>
                        <Image
                            source={sendImage}
                            style={styles.btnsImages}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal Correo */}
            <Modal
                style={styles.modalContainer}
                animationType='fade'
                transparent={true}
                visible={modalCorreo}
                onRequestClose={() => {
                    setModalCorreo(!modalCorreo);
                }}>
                <View style={styles.modalAdjuntos}>
                    <Text style={styles.titleSendEmail}>Enviar correo a: {route.params.lead[1]}</Text>
                    <FlatList style={styles.listaPlantillas}
                        data={plantillas}
                        renderItem={({ item }) =>
                            <View>
                                <View style={styles.btnPlantilla}>
                                    <RadioButton
                                        value={item.plantilla_id}
                                        label="Carto Base MAp"
                                        status={radioButtonPlantilla === item.plantilla_id ? 'checked' : 'unchecked'}
                                        onPress={() => { setradioButtonPlantilla(item.plantilla_id); }}
                                    />
                                    <View>
                                        <Text>{item.plantilla_encabezado}</Text>
                                        <Text style={styles.cuerpoPlantilla}>{item.plantilla_cuerpo}</Text>
                                    </View>
                                </View>
                            </View>
                        }
                    />
                    <TouchableOpacity
                        style={styles.btnSendCorreo}
                        onPress={() => sendEmail()}>
                        <Image
                            source={sendImage}
                            style={styles.btnsImages}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal Imagenes */}
            <Modal
                style={styles.modalContainer}
                animationType='fade'
                transparent={true}
                visible={modalArchivos}
                onRequestClose={() => {
                    setModalArchivos(!modalArchivos);
                }}>
                <View style={styles.modalAdjuntos}>
                    <TouchableOpacity
                        onPress={pickImage}>
                        <Text style={styles.titleSendPlantilla}>Selecciona una imagen</Text>
                    </TouchableOpacity>
                    {image &&
                        <View>
                            <Image source={{ uri: image }} style={{ width: 250, height: 250, marginTop: 10, borderRadius: 10, position: 'relative' }} />
                            <TouchableOpacity
                                style={styles.btnClean}
                                onPress={() => setImage('')}>
                                <Text style={{ color: 'white', fontSize: 14 }}>X</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <TouchableOpacity
                        style={styles.btnSendPlantilla}
                        onPress={() => sendImageUpload()}>
                        <Image
                            source={sendImage}
                            style={styles.btnsImages}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal Docs */}
            <Modal
                style={styles.modalContainer}
                animationType='fade'
                transparent={true}
                visible={modalDocs}
                onRequestClose={() => {
                    setModalDocs(!modalDocs);
                }}>
                <View style={styles.modalAdjuntos}>
                    <TouchableOpacity
                        onPress={pickImage}>
                        <Text style={styles.titleSendPlantilla}>Selecciona una Documento</Text>
                    </TouchableOpacity>
                    {image &&
                        <View>
                            <Image source={{ uri: image }} style={{ width: 250, height: 250, marginTop: 10, borderRadius: 10, position: 'relative' }} />
                            <TouchableOpacity
                                style={styles.btnClean}
                                onPress={() => setImage('')}>
                                <Text style={{ color: 'white', fontSize: 14 }}>X</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <TouchableOpacity
                        style={styles.btnSendPlantilla}
                        onPress={() => sendImageUpload()}>
                        <Image
                            source={sendImage}
                            style={styles.btnsImages}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal Cierre */}
            <Modal
                style={styles.modalContainer}
                animationType='fade'
                transparent={true}
                visible={modalCierre}
                onRequestClose={() => {
                    setModalCierre(!modalCierre);
                }}>
                <View style={styles.modalAdjuntos}>
                    <Text style={styles.titleSendEmail}>Motivo de cierre</Text>
                    <View>
                        <View style={styles.motivoCierre}>
                            <RadioButton
                                value="Sin stock"
                                status={radioButtonCierre === 'Sin stock' ? "checked" : "unchecked"}
                                onPress={() => { setradioButtonCierre("Sin stock") }}
                            />
                            <View>
                                <Text style={styles.textCierre}>Sin stock</Text>
                            </View>
                        </View>
                        <View style={styles.motivoCierre}>
                            <RadioButton
                                value="No interesado"
                                status={radioButtonCierre === 'No interesado' ? "checked" : "unchecked"}
                                onPress={() => { setradioButtonCierre("No interesado") }}
                            />
                            <View>
                                <Text style={styles.textCierre}>No interesado</Text>
                            </View>
                        </View>
                        <View style={styles.motivoCierre}>
                            <RadioButton
                                value="Datos incorrectos"
                                status={radioButtonCierre === 'Datos incorrectos' ? "checked" : "unchecked"}
                                onPress={() => { setradioButtonCierre("Datos incorrectos") }}
                            />
                            <View>
                                <Text style={styles.textCierre}>Datos incorrectos</Text>
                            </View>
                        </View>
                        <View style={styles.motivoCierre}>
                            <RadioButton
                                value="Venta"
                                status={radioButtonCierre === 'Venta' ? "checked" : "unchecked"}
                                onPress={() => { setradioButtonCierre("Venta") }}
                            />
                            <View>
                                <Text style={styles.textCierre}>Venta</Text>
                            </View>
                        </View>
                        <View style={styles.motivoCierre}>
                            <RadioButton
                                value="Sin medio de contacto"
                                status={radioButtonCierre === 'Sin medio de contacto' ? "checked" : "unchecked"}
                                onPress={() => { setradioButtonCierre("Sin medio de contacto") }}
                            />
                            <View>
                                <Text style={styles.textCierre}>Sin medio de contacto</Text>
                            </View>
                        </View>
                        <View style={styles.motivoCierre}>
                            <RadioButton
                                value="Bloqueo"
                                status={radioButtonCierre === 'Bloqueo' ? "checked" : "unchecked"}
                                onPress={() => { setradioButtonCierre("Bloqueo") }}
                            />
                            <View>
                                <Text style={styles.textCierre}>Bloqueo</Text>
                            </View>
                        </View>
                        <View style={styles.motivoCierre}>
                            <RadioButton
                                value="Esperando respuesta"
                                status={radioButtonCierre === 'Esperando respuesta' ? "checked" : "unchecked"}
                                onPress={() => { setradioButtonCierre("Esperando respuesta") }}
                            />
                            <View>
                                <Text style={styles.textCierre}>Esperando respuesta</Text>
                            </View>
                        </View>
                        <View style={styles.motivoCierre}>
                            <RadioButton
                                value="Inactivo"
                                status={radioButtonCierre === 'Inactivo' ? "checked" : "unchecked"}
                                onPress={() => { setradioButtonCierre("Inactivo") }}
                            />
                            <View>
                                <Text style={styles.textCierre}>Inactivo</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.btnSendCorreo}
                        onPress={() => sendCierre()}>
                        <Image
                            source={sendImage}
                            style={styles.btnsImages}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>

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
                        <TouchableOpacity
                            onPress={() => setModalAdjuntos(true)}>
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
        backgroundColor: '#f4511e',
    },
    btnSend: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: '#f4511e',
    },
    btnsImages: {
        width: 15,
        height: 15,
        marginLeft: 17,
        marginTop: 16
    },
    modalAdjuntos: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    imagesModal: {
        width: 100,
        height: 100,
    },
    btnsModals: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 20,
        marginBottom: 10,
        marginRight: 10
    },
    textBtn: {
        marginTop: 10,
        textAlign: 'center'
    },
    listaPlantillas: {
        width: 300,
        maxHeight: 550,
        padding: 10
    },
    titleSendPlantilla: {
        width: 300,
        textAlign: 'center',
        fontSize: 14,
        backgroundColor: '#f4511e',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    btnPlantilla: {
        maxWidth: 300,
        padding: 10,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        borderWidth: 1,
    },
    cuerpoPlantilla: {
        width: 220
    },
    btnSendPlantilla: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: '#f4511e',
        position: 'absolute',
        bottom: 15,
        right: 30
    },
    titleSendEmail: {
        width: 300,
        textAlign: 'center',
        fontSize: 14,
        backgroundColor: '#f4511e',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    inputAsunto: {
        width: 300,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10
    },
    inputMensaje: {
        width: 300,
        height: 150,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10
    },
    btnSendCorreo: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: '#f4511e',
        position: 'absolute',
        bottom: 15,
        right: 30
    },
    textBtnEmail: {
        textAlign: 'center',
        color: 'white'
    },
    motivoCierre: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center'
    },
    textCierre: {
        marginTop: 7.5
    },
    btnSelectUpload: {
        width: 250,
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10
    },
    textSelectUpload: {
        textAlign: 'center'
    },
    btnClean: {
        width: 30,
        height: 30,
        position: 'absolute',
        backgroundColor: '#f4511e',
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        right: 10,
        top: 20
    }
});

export default Chat