import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.css']
})
export class HistoryItemComponent implements OnInit {
  @Input() flat:string;
  @Input() flng:string;
  @Input() tlat:string;
  @Input() tlng:string;

  @Input() distance:string;
  @Input() price:string;

  scr:Array<Object> = new Array<Object>();

  constructor() { }

  ngOnInit() {
  }

}
