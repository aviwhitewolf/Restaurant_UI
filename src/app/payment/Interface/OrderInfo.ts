import { OrderItems } from "./OrderItems"

export interface OrderInfo{
    details? : any
    currency? : string
    orderId? : string
    orderItems : OrderItems[]
    user : number
    restaurantSlug : string
    table : string
    modeOfTransaction : string
    mCreatedBy? : number
    createdAt? : string
    mUpdatedBy? : number
    updatedAt? : string
    userInfo? : any
    modeOfPayment? : string,
    modeOfPaymentInfo? : any,
    cash? : number,
    online? : number
}
