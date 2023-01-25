export interface Expense {
    createdAt: string,
    id: number,
    description: string,
    price: number,
    type: string,
    currency: string,
    employee : {
        id: number,
        fullName: string,
        address: string,
        dateOfResignation: string,
        dateOfJoining: string,
        createdAt: string,
        updatedAt: string,
        publishedAt: string,
        salary: string,
        cronJob: string,
        gender: string,
        email: string,
        currency: string,
        countryCode: string,
        mobile: string,
        documentVerified: boolean
    }
    tags: {
        id?: number,
        name: string
    }
}