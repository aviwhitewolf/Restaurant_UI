interface Dish{
    id : string
    name : string
    price : number
    image : any
    currency : string
}

interface OrderDishCategory{
    id : string
    name : string
    unitPrice : number
    totalPrice : number
    quantity : number
}

export interface OrderItems{
    id : string
    dish : Dish
    orderDishCategory : OrderDishCategory[]
}
