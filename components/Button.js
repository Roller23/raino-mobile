import { Text, Pressable, StyleSheet } from 'react-native';

export default function Button(props) {
  const { onPress, title = '', btnStyle, textStyle } = props;
  return (
    <Pressable style={{...styles.button, ...btnStyle}} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
