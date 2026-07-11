export interface PublicUserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

export interface PublicUserCompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface PublicUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: PublicUserAddress;
  phone: string;
  website: string;
  company: PublicUserCompany;
}
