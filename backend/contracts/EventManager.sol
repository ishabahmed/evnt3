pragma solidity ^0.8.0;

contract EventManager { 

    struct Event {
        address organiser;
        string name;
        uint time;
        uint bookingCost;
        bool exists;
        mapping (address => bool) bookings;
    }

    event EventCreated(address organiser, string eventName, uint time, uint bookingCost);
    event EventBooked(uint eventId, address booker);

    mapping (uint => Event) public events;

    // organiser creates new event
    function createEvent(string memory _name, uint _time, uint _bookingCost) public returns (uint) {
        require(_time > block.timestamp, "Event time must be in the future.");
        require(_bookingCost >= 0, "Negative booking cost now allowed.");
        
        uint eventId = uint(keccak256(abi.encodePacked(msg.sender, _name, _time)));
        require(events[eventId].exists == false, "Event of this name and time already created by this user!");
        
        // event created this way to allow for nested mappings
        // ( events[eventId] = Event(msg.sender, _name, _startTime, _endTime, _bookingCost, true) )
        Event storage e = events[eventId];
        e.organiser = msg.sender;
        e.name = _name;
        e.time = _time;
        e.bookingCost = _bookingCost;
        e.exists = true;
        
        emit EventCreated(msg.sender, _name, _time, _bookingCost);

        return eventId;
    }

}