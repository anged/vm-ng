import { Injectable } from '@angular/core';

import { MapService } from '../../../map.service';


@Injectable()
export class ProfileToolService {

  constructor(
    private mapService: MapService
  ) { }

}
