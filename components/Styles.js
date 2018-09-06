
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  registerHeader: {
    fontSize: 30,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    fontWeight: 'bold',
    alignItems: 'flex-start'
  },
  startButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: '#fff',
  },
  registerButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: '#fff',
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#fffdd0'
  },
  homeHeader: {
    backgroundColor: '#ffd300',
    alignItems: 'center'
  },
  homeTitles: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 30
  },
  tabStyle: {
    borderColor: '#D52C43',
    width: 50
  },
  activeTabStyle: {
    backgroundColor: '#D52C43'
  },
  labelSelect: {
    marginTop: 5,
    marginBottom: 20,
    padding: 5,
    borderWidth: 1,
    borderRadius: 6,
    borderStyle: 'dashed',
    borderColor: 'black'
  },
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  },
  textInput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    fontSize: 20,
    marginLeft: 30,
    marginRight: 30,
    borderBottomColor: '#fff',
    borderBottomWidth: 1
  },
  textInput2: {
    alignSelf: 'stretch',
    height: 50,
    marginBottom: 20,
    color: '#fff',
    borderBottomColor: '#fff',
    borderBottomWidth: 1
  },
  addButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    marginTop: 5,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: '#ffd300',
  },
  addInput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 15,
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30,
    borderBottomColor: '#ffd300',
    borderBottomWidth: 1
  }
});


export default styles;
