import { Injectable } from '@angular/core';

import {Subject} from 'rxjs/Subject';


@Injectable()
export class MenuService {

  private subLayersActive: boolean = false;

  private subLayersObs = new Subject();

  subLayersActivation = this.subLayersObs.asObservable();

  getSubState(): subLayersActive {
    return this.subLayersActive;
  }

  //update Sub layr list state after toggle button click
  updateSubState() {
    this.subLayersActive = !this.subLayersActive;
    this.subLayersObs.next(this.subLayersActive);
    return this.subLayersActive;
  }

  //set listMode valueto "show" based whether you showing
  //theme layers or sub layers list
  //layersType: "theme" (main theme layers) or  "all-layers" (sub list layers)
  listModeSelection(layersType: string = "theme", items: any) {
    let newItems;
    //console.log(items)
    if (layersType === "theme") {
       newItems = items.map((item)=>{
         if (item.id == "all-layers")  {
           item.listMode = "hide";
           return item;
         } else {
           item.listMode = "show";
           return item;
         }
      });
      //console.log("NEW ITEMS", newItems);
      return newItems;
    } else if (layersType ==="all-layers" ) {
      newItems =  items.map((item)=>{
        if (item.id == "all-layers")  {
          item.listMode = "show";
          return item;
        } else {
          item.listMode = "hide";
          return item;
        }
      });
      //console.log("NEW ITEMS", newItems);
      return newItems;
    }
  }
}
