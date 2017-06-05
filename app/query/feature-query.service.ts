import { Injectable } from '@angular/core';

import { MapService } from '../map.service';
import { ProjectsFilterService } from '../projects-list/projects-filter.service';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class FeatureQueryService {
  //deactivated theme filter properties, created and updated dinamycally (on click)
  //example: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true};
  private deactivatedThemeFilters: any;
  //theme filter fiters properties, created and updated dinamycally
  private deactivatedYearFilters: any;

  private expressionSQL = {
    theme: [],
    year: []
  };
  private expressionCommon = {
    theme: [],
    year: []
  };
  //pass expression to map component for list filtering based on active filters
  private expressionToMapComponent: String;

  // Observable  source, start from empty ("") string
  private expressionStObs = new BehaviorSubject<any>("");
  // Observable item stream
  expressionItem = this.expressionStObs.asObservable();

  constructor(private _mapService: MapService, private projectsFilterService: ProjectsFilterService) {}

  //create years Object from years for filtering  by year or
  //create themes Object from themes for filtering  by theme
  sendToMap(years: string[], themes: Number[]) {
    //console.log("REDUCE: ", years.reduce((acc, cur, i) => {acc[cur] = true; return acc;}, {}) )
    this.deactivatedThemeFilters = themes.reduce((acc, cur, i) => {acc[cur.toString()] = true; return acc;}, {});
    this.deactivatedYearFilters = years.reduce((acc, cur, i) => {acc[cur] = true; return acc;}, {});
  }

  // service command
  changeExpression(expression) {
    this.expressionStObs.next(expression);
  }

  // return current SQL expression string which is set by UI filters
  getExpression() {
    return this.expressionToMapComponent;
  }

  //filter by theme
  filterFeatures(theme: Number) {
    //console.log("BENDRA UZKL" , this.expressionCommon);
    if (this.deactivatedThemeFilters[theme.toString()]) {
      let expression;
      let expressionFinal: string;
      //push theme to array
      this.expressionSQL.theme.push(theme);
      //filter by TemaID
      expression = this.getFilterQuery(this.expressionSQL.theme, "TemaID", "=");
      //change common expression
      this.expressionCommon.theme[0] = expression;
      expressionFinal = this.runDefinitionExpression("theme", "year");
      //console.log(this.expressionSQL);
      //console.log(this.expressionCommon.theme);
      this._mapService.returnFeatureLayers().map(feature => {
          feature.definitionExpression = expressionFinal;
      });
      this.deactivatedThemeFilters[theme.toString()] = false;
      //console.log(this._mapService.returnFeatureLayers());
    } else {
      //get indexof theme and remove it
      let index = this.expressionSQL.theme.indexOf(theme);
      let expression;
      let expressionFinal: string;
      if (index > -1) {
        this.expressionSQL.theme.splice(index, 1);
      }
      //filter by TemaID
      expression = this.getFilterQuery(this.expressionSQL.theme, "TemaID", "=");
      //change common expression
      this.expressionCommon.theme[0] = expression;
      expressionFinal = this.runDefinitionExpression("theme", "year");
      //console.log(this.expressionSQL);
      //console.log(this.expressionCommon.theme);
      this._mapService.returnFeatureLayers().map(feature => {
          //console.log("THEME", this.expressionCommon.theme[0]);
          //console.log("YEAR LENGTH", this.expressionCommon.year.length );
          feature.definitionExpression = expressionFinal;
      });
      this.deactivatedThemeFilters[theme.toString()] = true;
    }
  }

  getFilterStatusTheme() {
      return this.deactivatedThemeFilters;
  }
  getFilterStatusYear() {
      return this.deactivatedYearFilters;
  }

  //run definition by specific expression depended on first and second filters
  //for example: first filter is themes and second filter is years
  runDefinitionExpression(firstFilter: string, secondFilter: string) {
    //console.log("THEME", this.expressionCommon[firstFilter][0]);
    //console.log("YEAR LENGTH", this.expressionCommon[secondFilter].length );
    if (this.expressionCommon[secondFilter].length > 0) {
      //if string is empty, like ""
      if ((this.expressionCommon[firstFilter][0].length > 0) && (this.expressionCommon[secondFilter][0].length > 0)) {
        this.expressionToMapComponent = "(" + this.expressionCommon[firstFilter][0] +") AND (" + this.expressionCommon[secondFilter][0] + ")";
        this.changeExpression("(" + this.expressionCommon[firstFilter][0] +") AND (" + this.expressionCommon[secondFilter][0] + ")");
        return "(" + this.expressionCommon[firstFilter][0] +") AND (" + this.expressionCommon[secondFilter][0] + ")";
      } else if (((this.expressionCommon[secondFilter][0].length > 0) && (this.expressionCommon[firstFilter][0].length === 0))){
        this.expressionToMapComponent = this.expressionCommon[secondFilter][0];
        this.changeExpression(this.expressionCommon[secondFilter][0]);
        return this.expressionCommon[secondFilter][0];
      } else {
        //alert(2)
        this.expressionToMapComponent = this.expressionCommon[firstFilter][0];
        this.changeExpression(this.expressionCommon[firstFilter][0]);
        return this.expressionCommon[firstFilter][0];
      }
    } else {
      this.expressionToMapComponent = this.expressionCommon[firstFilter][0];
      this.changeExpression(this.expressionCommon[firstFilter][0]);
      return this.expressionCommon[firstFilter][0];
    }
  }

  getFilterQuery(expressionArray: Array<any>, property: String, operator: string) {
    let queryStringClause: String = "";
    //console.log(expressionArray);
    for (let i=0; i < expressionArray.length; i += 1) {
      if (expressionArray[i]) {
        if ((expressionArray.length - 1 - i) === 0) {
            if (operator === "=") {
              queryStringClause += property + operator + "'" + expressionArray[i] + "'";
            } else {
                queryStringClause += property + operator + "'%" + expressionArray[i] + "%'";
            }
        } else if ((expressionArray.length) === 0) {
            queryStringClause += "";
        } else {
            //if theme filter
            if (operator === "=") {
              queryStringClause += property + operator + "'" + expressionArray[i] + "' OR ";
            } else {
              //else year filter
              queryStringClause += property + operator + "'%" + expressionArray[i] + "%' OR ";
            }
        }
      }
    }
    return queryStringClause;
  }

  //filter by year
  yearFilterQuery(year) {
    //console.log("BENDRA UZKL", this.expressionSQL);
    //console.log("BENDRA UZKL", this.expressionCommon);
    if (this.deactivatedYearFilters[year]) {
      let expression;
      let expressionFinal: string;
      //push theme to array
      this.expressionSQL.year.push(year);
      expression = this.getFilterQuery(this.expressionSQL.year, "Igyvend_IKI", " LIKE ");
      //change common expression
      this.expressionCommon.year[0] = expression;
      expressionFinal = this.runDefinitionExpression("year", "theme");
      this._mapService.returnFeatureLayers().map(feature => {
          feature.definitionExpression = expressionFinal;
      });
      this.deactivatedYearFilters[year] = false;
    } else {
      //get indexof theme and remove it
      let index = this.expressionSQL.year.indexOf(year);
      let expression;
      let expressionFinal: string;
      if (index > -1) {
        this.expressionSQL.year.splice(index, 1);
      }
      expression = this.getFilterQuery(this.expressionSQL.year, "Igyvend_IKI", " LIKE ");
      //change common expression
      this.expressionCommon.year[0] = expression;
      expressionFinal = this.runDefinitionExpression("year", "theme");
      //console.log(this.expressionCommon.year);
      this._mapService.returnFeatureLayers().map(feature => {
        feature.definitionExpression = expressionFinal;
      });
      this.deactivatedYearFilters[year] = true;
    }
  }
}
