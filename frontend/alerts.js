import { Alert } from "react-native"

export const alertInfo = (title, message) => {
    Alert.alert(title, message, [{ text: 'Aceptar' }]);
}
