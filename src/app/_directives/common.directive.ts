import { Directive, OnInit } from "@angular/core";

@Directive({
  selector: '[lsm-tooltip]'
})
export class CommonDirective implements OnInit {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
}