export class Customer {
    id!: string;
    salutation!: string;
    firstName!:  string;
    lastName!: string;
    addresses!: Address;
    mobilephone!: string;
    homePhone!: string;
    homeEmail!: string;
}

export class Address {
    addressLine1!: string;
    addressLine2!: string;
    addressLine3!: string;
    city!: string;
    countryState!: string;
    zipcode!: string;
    country!: string;
}