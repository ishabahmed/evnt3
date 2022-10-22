pragma solidity ^0.8.0;

contract EventManager { 

    struct Event {
        address organiser;
        string name;
        uint startTime;
        uint endTime;
        uint bookingCost;
        bool exists;
        mapping (address => bool) bookings;
    }

    event EventCreated(uint eventId);
    event EventBooked(uint eventId, address booker);
    event EventDetails(address, string, uint, uint, uint);

    mapping (uint => Event) public events;

    // organiser creates new event
    function createEvent(string memory _name, uint _startTime, uint _endTime, uint _bookingCost) public {
        // require(_startTime > block.timestamp && _endTime > _startTime, "Event time must be in the future.");
        // require(_bookingCost >= 0, "Negative booking cost now allowed.");
        
        uint eventId = uint(keccak256(abi.encodePacked(msg.sender, _name, _startTime, _endTime)));
        // require(events[eventId].exists == false, "Event of this name and time already created by this user!");
        
        // event created this way to allow for nested mappings
        // ( events[eventId] = Event(msg.sender, _name, _startTime, _endTime, _bookingCost, true) )
        Event storage e = events[eventId];
        e.organiser = msg.sender;
        e.name = _name;
        e.startTime = _startTime;
        e.endTime = _endTime;
        e.bookingCost = _bookingCost;
        e.exists = true;
        
        emit EventCreated(eventId);
    }

    // user books the event by depositing the required amount and supplying event id
    function bookEvent(uint _eventId) public payable {
        require(events[_eventId].exists == true, "Event with that ID does not exist.");
        require(events[_eventId].bookings[msg.sender] == false, "You have already booked this event!");
        require(events[_eventId].endTime > block.timestamp, "The event has already ended.");
        require(events[_eventId].bookingCost == msg.value, "Wrong booking cost sent for event.");
        
        events[_eventId].bookings[msg.sender] = true;
        emit EventBooked(_eventId, msg.sender);
    }

    // check if user has booked a specific event or not
    function checkBooking(uint _eventId) public view returns (bool) {
        require(events[_eventId].exists == true, "Event with that ID does not exist");
        return events[_eventId].bookings[msg.sender];
    }

    // return details from specific event struct
    function getEventDetails(uint _eventId) public {
        require(events[_eventId].exists == true, "Event with that ID does not exist");
        emit EventDetails(events[_eventId].organiser, events[_eventId].name, events[_eventId].startTime, events[_eventId].endTime, events[_eventId].bookingCost);
    }
}