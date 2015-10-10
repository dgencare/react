var _state = {
    // your state container where 
};


var EntityStore = merge(Store, {
    getState: function() {
        return _state;
    },
});


function persistEntityData(response) {
    console.log(response);
}


EntityStore.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.actionType) {
        case Constants.api.GET_ENTITY_DATA:
            persistEntityData(action.response);
            break;
        default:
            return true;
    }
    EntityStore.emitChange();
    return true;
});

module.exports = EntityStore;