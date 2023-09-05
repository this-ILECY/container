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

  @ViewChild('allMother', { static: true }) AlMother: ElementRef;
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










}


* if this isn't an auto-generated template,
* and count of html element and their configs do not match,
* throws error
* (parent configs won't be included (IsParent = true))
*/ configValidator() {
let childCount = Array. from(((this .AllMother.nativeElement) as Element) children).filter(x => lx.classList.contains("controller")) . length;
if (this.gridConfig. ElementConfig. length I= 0 && childCount I=s this gridConfig. ElementConfig.filter(x -> Ix. IsParent). length &S (Ithis.gridConfig. Auto Template))
throw new Error("Uncaught (in promise): TypeError: count of configs did not match your page. \nat Ray-Container. InPlease make sure you have added correct configuration
private rowCountController = 0;
7*
* generating handlers, setting the configs and adding classes
*/ pageGenerator0) {
let allMother = (this.Al(Mother nativeElement) as Element
this.rowCountController = getComputedStyle(allMother).gridTemplateRows.split(" "). Length;
if (Ithis-gridConfig) return;
(allMother as HTMLElement).style.gridTemplateColumns = 'repeat(' + this.gridConfig .Resolution + ', 1fr)';
(allMother as HTMLElement).style.gridTemplateRows = 'repeat(' + this .gridConfig. ResolutionY + ', 1fr)'
if (this.gridConfig. Element Config. length = 0) return;
let generatedList = this. listGenerator(this .gridConfig.ElementConfig);
let index = 0;
