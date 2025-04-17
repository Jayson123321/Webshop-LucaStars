![SequenceDiagram](image-1.png)
- website: https://sequencediagram.org/
- bijbehorende code

title Sequence Diagram
```
participant Customer
participant Frontend
participant Backend
participant Database

entryspacing 0.8
Customer -> Frontend: Open webshop
Frontend -> Backend: Request Orderitems
Backend -> Database: Retrieve Orderitems
Database -> Backend: Return Orderitems
Backend -> Frontend: Return Orderitems
Frontend -> Customer: Display Orderitems
Customer -> Frontend: Add item to cart
Frontend -> Backend: Add item to cart
Cart -> Database
Backend->Database:Add item to cart
Database -> Backend: Confirm item added
Backend -> Frontend: Confirm item added
Frontend -> Customer: Confirm item added

Customer -> Frontend: Enter shipping details
Frontend -> Backend: Send shipping details
Backend -> Database: Store shipping details
Database -> Backend: Confirm shipping details stored
Backend -> Frontend: Confirm shipping details stored
Frontend -> Customer: Confirm shipping details stored
```