
<View style={{position:'absolute', top: 100}}>
  <MaterialIcons.Button
    name="receipt"
    backgroundColor="#808080"
    size={30}
    onPress={() => this.togglePanel()}
    {...iconStyles}
  >
    + Bill
  </MaterialIcons.Button>
</View>


<SlidingUpPanel
  visible={this.state.visible}
  allowMomentum={true}
  onRequestClose={() => this.togglePanel()}>
  <View style={{flex: 1, backgroundColor: 'aliceblue'}}>
    <View style={{alignItems: 'center'}}>
      <FontAwesome
        name="caret-down"
        size={40}
        onPress={() => this.togglePanel()}
      >
      </FontAwesome>
    </View>
    <KeyboardAvoidingView behavior="padding" style = {{alignItems: 'center', justifyContent: 'center', backgroundColor: 'aliceblue'}}>

      <FormLabel>Group</FormLabel>
      <Dropdown
        // label='Group'
        // value={this.state.groupName}
        onChangeText={(value, index, data) => this.selectGroup(value, index, data)}
        data={this.state.groupPicks}
        containerStyle={{width: 100}}
      />

      <FormLabel>Participants</FormLabel>
      <LabelSelect
        title="Checkbox"
        ref="select"
        style={styles.labelSelect}
        onConfirm={this.selectConfirm}
      >
        {this.state.participants.filter(item => item.isSelected).map((item, index) =>
          <LabelSelect.Label
            key={'label-' + index}
            data={item}
            onCancel={() => {this.deleteItem(item);}}
          >{item.name}</LabelSelect.Label>
        )}
        {this.state.participants.filter(item => !item.isSelected).map((item, index) =>
          <LabelSelect.ModalItem
            key={'modal-item-' + index}
            data={item}
          >{item.name}</LabelSelect.ModalItem>
        )}
      </LabelSelect>

      <FormLabel>Title</FormLabel>
      <FormInput onChangeText={(text) => this.setState({title: text})}/>

      <FormLabel>Total</FormLabel>
      <FormInput onChangeText={(text) => this.setState({total: text})}/>

      {/* <FormLabel>Payer</FormLabel>
      <FormInput onChangeText={(text) => this.setState({title: text})}/>

      <FormLabel>Payer</FormLabel>
      <FormInput onChangeText={(text) => this.setState({title: text})}/> */}

      {/* + payer, participants, group => default: from this.props.group */}

      <DatePicker
        style={{width: 200}}
        date={this.state.date}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({date: date})}}
      />

      <TouchableOpacity
        style={{backgroundColor: 'black', borderRadius: 10, width: 200, height: 50}}
        onPress={() => this.add()}>
        <Text style = {{
          textAlign: 'center',
          fontSize: 20,
          color: '#fff'
        }}>Enter</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  </View>
</SlidingUpPanel>
