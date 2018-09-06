

<View>
  <MaterialIcons.Button
    name="delete-sweep"
    backgroundColor="#3b5998"
    size={30}
    onPress={() => this.toggleChore()}
    {...iconStyles}
  >
    + Chore
  </MaterialIcons.Button>
</View>


<SlidingUpPanel
  visible={this.props.visible}
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

      <FormLabel>In charge</FormLabel>
      <LabelSelect
        title="Who's in charge"
        ref="select"
        style={styles.labelSelect}
        onConfirm={this.selectConfirm}
      >
        {this.state.inCharge.filter(item => item.isSelected).map((item, index) =>
          <LabelSelect.Label
            key={'label-' + index}
            data={item}
            onCancel={() => {this.deleteItem(item);}}
          >{item.name}</LabelSelect.Label>
        )}
        {this.state.inCharge.filter(item => !item.isSelected).map((item, index) =>
          <LabelSelect.ModalItem
            key={'modal-item-' + index}
            data={item}
          >{item.name}</LabelSelect.ModalItem>
        )}
      </LabelSelect>

      <FormLabel>Title</FormLabel>
      <FormInput onChangeText={(text) => this.setState({title: text})}/>

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
