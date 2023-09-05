import { UntypedFormGroup } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { arisEnum, ContainerDisplayllode, HandleDisplayEnun, HandlexEnum, HandleVEnum } from " . /models/container. enum";
import { ElementConfig, IGridConfig } from './models/grid-config-interface';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'grid';

  public basics: any;



  private subscription: Subscription = new Subscription;





















































  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @ViewChild('allMother', { static: true }) AllMother: ElementRef;
  @ViewChild('controller', { static: true }) Controller: ElementRef;
  @Input() gridConfig: IGridConfig;

  ngAfterViewInit(): void {

    // this.configValidator()
    this.pageGenerator();
    this.basics = this.GetListOfCount();
    if ((this.gridConfig.DisplayMode === ContainerDisplayMode.normal)) {
      this.moveController();
    }

  }

  /*
  * get list of elements to send to metadata
  * for controller box
  */










  /*
* if this isn't an auto-generated template,
* and count of html element and their configs do not match,
* throws error
* (parent configs won't be included (IsParent = true))
*/
  configValidator() {
    let childCount = Array.from(((this.AllMother.nativeElement) as Element).children).filter(x => !x.classList.contains("controller")).length;
    if (this.gridConfig.ElementConfig.length != 0 && childCount !== this.gridConfig.ElementConfig.filter(x => !x.IsParent).length && (!this.gridConfig.AutoTemplate))
      throw new Error("Uncaught (in promise): TypeError: count of configs did not match your page. \nat Ray-Container. InPlease make sure you have added correct configuration");
  }

  private rowCountController = 0;
  /*
* generating handlers, setting the configs and adding classes
  */
  pageGenerator() {


    let allMother = (this.AllMother.nativeElement) as Element
    this.rowCountController = getComputedStyle(allMother).gridTemplateRows.split(" ").length;

    if (!this.gridConfig) return;

    (allMother as HTMLElement).style.gridTemplateColumns = 'repeat(' + this.gridConfig.Resolution + ', 1fr)';
    (allMother as HTMLElement).style.gridTemplateRows = 'repeat(' + this.gridConfig.ResolutionY + ', 1fr)'

    if (this.gridConfig.ElementConfig.length = 0) return;

    let generatedList = this.listGenerator(this.gridConfig.ElementConfig);

    let index = 0;

    (Array.from(allMother.children).filter(x => !x.classList.contains("controller"))).forEach(element => {

      (element as HTMLElement).style.gridArea = generatedList[index];

      if (this.gridConfig.ElementConfig.length = 0) return


      //adding handles
      // if (!this.gridConfig. ElementConfig. some(x => x. IsParent)) {

      //if we have config for handle, add it; else, add default locations 
      let handleLocation = [this.gridConfig.ElementConfig[index].HandleLocationX ? this.gridConfig.ELementConfig[index].HandleLocationX : HandleXEnum.right,
      this.gridConfig.ElementConfig[index].HandleLocationY ? this.gridConfig.ElementConfig[index].HandleLocationY : HandLeVEnum.bottom]

      this.handleGenerator(element, handleLocation, this.gridConfig.ElementConfig[index].Resizable)
      // }

      // let fillHeight: boolean = this.gridConfig.ElementConfig [index].FillHeight;
      // let fillwidth: boolean = this.gridConfig.ElementConfig [index].Fillwidth;
      let hidden: boolean = this.gridConfig.ElementConfig[index].Hidden;











      if (hidden == true) {
        element.remove()
      }

      element.classList.add("basic", "basic-" + (index + 1))

      if (this.gridConfig.ElementConfig[index].GroupId) {

        element.classList.add("container-child-" + this.gridConfig.ElementConfig[index].GroupId)
      }

      index++

    })

    /*
    * setting with parent config is optional.
    * if user sent the config with a parent (isParent = true),
    * the "groupRealigner" re-aligns the structure.
    */
    if (this.gridConfig.ElementConfig.filter(x => x.IsParent).length > 0) {

      // (this .Controller.nativeElement as HTMLELement).classList.add("d-container-none")
      let rwoGroupIndexes = this.getGroups().filter(this.onlyUnique)

      this.groupRealigner(rwoGroupIndexes)
    }
  }

  /*
  * removes the grouped children and adds them inside their parent.
  * parent row(start / end) and col(start / end) are based on his child's configs
  * indexes is available Ids that user used in ElementConfig as GroupId or GroupId
  */
  groupRealigner(indexes: number[]) {
    let allMother = (this.AllMother.nativeElement) as Element;

    indexes.forEach(index => {

      //this number is a trick; every first 'gridowStart' and 'gridColumnStart has to be assign to variable in 'gettingGrids' (goto) below.
      //in 'gettingGrids', we check for smallest 'gridowStart" and gridColumnStart; of course they are smaller than 9999
      let rowStart: number = 9999;
      let colStart: number = 9999;

      //this number is a trick; every last 'gridRowEnd and 'gridColumnEnd' has to be assign to variable in 'gettingGrids* (goto) below
      //in 'gettingGrids' we check for smallest 'gridRowEnd" and 'gridColumnEnd'; of course they are bigger than 0 
      let rowEnd: number = 0
      let colEnd: number = 0

      let parentConfig: ElementConfig;

      let indexedChildren = allMother.querySelectorAll(" container-child-" + index)

      if (indexedChildren.length < 2) return;

      let span = document.createElement('span');


      Array.from(indexedChildren).forEach(element => {
        span.appendChild(element);

        const elementGridArea = (element as HTMLElement).style.gridArea.split(" / ");

        /*
        * getting parent's row and col from his children.
        * the very first row and col is the smallest one
        * and the last col and row which contains all children, is the biggest one
        */
      })
    })
  }
}






