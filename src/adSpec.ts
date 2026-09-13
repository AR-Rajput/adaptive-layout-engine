//Content of Advertisement
import logoImage from "./assets/logo.png";
import productAsset from "./assets/product.png";
import type { AdElement } from "./types/layout";

export const headline: AdElement = {
    name: "headline",
    priority: 1,
    preferredWidth:300,
    preferredHeight:60,
    minWidth: 150,
    minHeight: 40,
    content: "Summer Sale - 50% off",
    type: "text",
    fontSize:32
}; 

export const productImage: AdElement = {
    name: "productImage",
    priority: 1,
    preferredWidth:400,
    preferredHeight:400,
    minWidth: 150,
    minHeight: 150,
    content: productAsset,
    type:"image",
    fontSize:0
};

export const price: AdElement = {
    name: "price",
    priority: 2,
    preferredWidth:140,
    preferredHeight:50,
    minWidth: 100,
    minHeight: 40,
    content: "$49.99",
    type:"text",
    fontSize:24
};

export const cta: AdElement = {
    name: "cta",
    priority: 2,
    preferredWidth:160,
    preferredHeight:56,
    minWidth: 120,
    minHeight: 48,
    content: "Buy Now",
    type: "button",
    fontSize:18
};

export const logo: AdElement = {
    name: "logo",
    priority: 3,
    preferredWidth:100,
    preferredHeight:50,
    minWidth: 80,
    minHeight: 40,
    content: logoImage,
    type: "image",
    fontSize:0
};

export const adSpec: AdElement[] = [
    headline,
    productImage,
    price,
    cta,
    logo
];
