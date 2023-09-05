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

  }
}


(Array.from (allMother. children).filter(x -> Ix.classList.contains("controller"))).forEach(element =>
(element as HTMLELement) .style.gridArea = generatedList [index]
if (this.gridConfig. ElementConfig .length = 0) return
//adding handles
// if CIthis.gridConfig. ElementConfig. some(x => x. IsParent)) {
/if we have config for handle, add it; else, add default locations let handLeLocation - [this.gridConfig. ElementConfig [index] .HandleLocationx 3 this.gridConfig.ELementConfig[index] .HandleLocationX : HandleXEnum.right, this.gridConfig.ElementConfig[index].HandleLocationY?this.gridConfig.ElementConfig[index].HandleLocationY:HandLeVEnum.bottom]
this. handleGenerator (element, handleLocation, this.gridConfig .ElementConfig[index] .Resizable)
// }
// let fillHeight: boolean = this.gridConfig. ElementConfig [index] .FillHeight;
// let fillwidth: boolean = this .gridConfig. ElementConfig [index] .Fillwidth;
let hidden: boolean = this.gridConfig. ElementConfig [index].Hidden;
// iF (fillHeight) {
//
//
element.classList.add("f1ll-height");
let elm = (element as HTMLElement). parentElement I
this.resize(elm, axisEnum.y,
'1', getComputedstyle(elm).gridColumnStart, (rowCount + 1). toString), getComputedstyle(elm) .gridColumnEnd);
/ if (filwidth) {
element.classList.add("fill-width")
let elm = (element as HTMLElement).parentElement!
this. resize(element as HTMLElement, axisEnum.x, getComputedStyle(elm) .gridRowStart, '1', getComputedStyle(elm) gridRomEnd, (colCount + 1). toString));
1f (hidden as true) {
element remove(
}
element. classlist.add("basic", "basic-" + (index + 1)) if (this.gridConfig. Element Config [index].GroupId) (
element .classList.add("container-child-" + this.gridConfig .ElementConfig(index].GroupId)
index++
])
