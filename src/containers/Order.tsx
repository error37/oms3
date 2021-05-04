export class LineItem {
    actualSalesUnitPrice!: bigint;
    beginDateTime!: string;
    description!: string;
    extendedAmount!: bigint;
    extendedDiscountAmount!: bigint;
    id!: bigint;
    lastModified!: string;
    orderObjectId!: bigint;
    sequenceNumber!: bigint;
    sku!: string;
    taxAmount!: bigint;
    taxRule!: string;
    taxableAmount!: bigint;
}

export class Order {
    id!: string;
    channel!: string;
    customerId!: bigint;
    lastModified!: string;
    lineItem!: LineItem[];
    specialOrderNumber!: string;
    status!: string;
    transactionBalanceDueAmount!: bigint;
    transactionGrandAmount!: bigint;
    transactionNetAmount!: bigint;
    transactionTenderApplied!: bigint;
    transactionTotalSavings!: bigint;

    public getDate = () => this.lastModified;
}
