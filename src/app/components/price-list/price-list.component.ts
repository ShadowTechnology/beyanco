import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-price-list',
  imports: [RouterModule],
  templateUrl: './price-list.component.html',
  styleUrl: './price-list.component.css'
})
export class PriceListComponent {
  name: any;
  price: any;
  currency: any;
  features: any;

  currencies = [
    { symbol: "$", label: "USD" },
    { symbol: "₹", label: "INR" },
    { symbol: "€", label: "EUR" },
    { symbol: "£", label: "GBP" },
    { symbol: "¥", label: "JPY" }
  ];

  createPlan() {
    const plan = {
      name: this.name,
      price: this.price,
      currency: this.currency,
      features: this.features.split("\n")
    };

    console.log("Created Plan:", plan);
  }

}
