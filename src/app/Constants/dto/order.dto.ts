export interface Order {
    createdAt: string,
    id: number,
    orderId: string,
    totalAmount: number,
    tax: number,
    status: string,
    details: any,
    currency: string,
    razorpayOrderId: string,
    razorpayStatus: string,
    foodStatus: string,
    preparationTime: string,
    updatedAt: string,
    publishedAt: string,
    tableNumber: string,
    orderItems: any,
    user: {
        id: number,
        username: string,
        email: string,
        fullName: string,
        number: string
    }
}