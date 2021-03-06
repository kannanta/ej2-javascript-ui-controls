import { detach, isNullOrUndefined as isNOU} from '@syncfusion/ej2-base';
import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';

/**
 * XhtmlValidation module called when set enableXhtml as true
 */
export class XhtmlValidation {
    private parent: SfRichTextEditor;
    private currentElement: HTMLElement;
    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(events.xhtmlValidation, this.enableXhtmlValidation, this);
        this.parent.observer.on(events.destroy, this.removeEventListener, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.xhtmlValidation, this.enableXhtmlValidation);
        this.parent.observer.off(events.destroy, this.removeEventListener);
    }
    private enableXhtmlValidation(): void {
        if (this.parent.enableXhtml) {
            if (isNOU(this.parent.inputElement)) {
                this.currentElement = this.parent.element;
            } else {
                this.currentElement = this.parent.inputElement;
            }
            this.clean(this.currentElement);
            this.AddRootElement();
            this.ImageTags();
            this.removeTags();
            this.RemoveUnsupported();
            this.currentElement.innerHTML = this.selfEncloseValidation(this.currentElement.innerHTML);
        }
    }
    public selfEncloseValidation(currentValue: string): string {
        currentValue = currentValue.replace(/<br>/g, '<br/>').replace(/<hr>/g, '<hr/>').replace(/&nbsp;/gi, ' ').replace(/ /g, ' ');
        let valueTemp: RegExpExecArray;
        let valueDupe: string[] = [];
        let valueOriginal: string[] = [];
        let imgRegexp: RegExp[] = [ /<img(.*?)>/gi, /<area(.*?)>/gi, /<base(.*?)>/gi, /<col (.*?)>/gi, /<embed(.*?)>/gi,
        /<input(.*?)>/gi, /<link(.*?)>/gi, /<meta(.*?)>/gi, /<param(.*?)>/gi, /<source(.*?)>/gi,
        /<track(.*?)>/gi, /<wbr(.*?)>/gi ];
        for (let j: number = 0; j < imgRegexp.length; j++) {
            valueTemp = imgRegexp[j].exec(currentValue);
            while ((valueTemp) !== null) {
                valueDupe.push(valueTemp[0].toString());
                valueTemp = imgRegexp[j].exec(currentValue);
            }
            valueOriginal = valueDupe.slice(0);
            for (let i: number = 0; i < valueDupe.length; i++) {
                if (valueDupe[i].indexOf('/') === -1 || valueDupe[i].lastIndexOf('/') !== valueDupe[i].length - 2) {
                    valueDupe[i] = valueDupe[i].substr(0, valueDupe[i].length - 1) + ' /' +
                    valueDupe[i].substr(valueDupe[i].length - 1, valueDupe[i].length);
                }
            }
            for (let g: number = 0; g <= valueDupe.length - 1; g++) {
                currentValue = currentValue.replace(valueOriginal[g], valueDupe[g]);
            }
        }
        return currentValue;
    }
    private AddRootElement(): void {
        if ((this.currentElement.childNodes.length === 1 && this.currentElement.firstChild.nodeName !== 'DIV') ||
            this.currentElement.childNodes.length > 1) {
            let parentEle: HTMLElement = document.createElement('div');
            while (this.currentElement.childNodes.length > 0) {
                parentEle.appendChild(this.currentElement.childNodes[0]);
            }
            this.currentElement.appendChild(parentEle);
        }
    };
    private clean(node: HTMLElement): string {
        for (let n: number = 0; n < node.childNodes.length; n++) {
            let child: HTMLElement = node.childNodes[n] as HTMLElement;
            if (child.nodeType === 8 || child.nodeName === 'V:IMAGE') {
                node.removeChild(child);
                n--;
            } else if (child.nodeType === 1) {
                this.clean(child);
            }
        }
        return this.currentElement.innerHTML;
    }
    private ImageTags(): void {
        let imgNodes: NodeListOf<HTMLElement> = this.currentElement.querySelectorAll('IMG');
        for (let i: number = imgNodes.length - 1; i >= 0; i--) {
            if (!imgNodes[i].hasAttribute('alt')) {
                let img: Element = imgNodes[i];
                img.setAttribute('alt', '');
            }
        }
    };
    private removeTags(): void {
        let removeAttribute: string[][] = [['br', 'ul'], ['br', 'ol'], ['table', 'span'], ['div', 'span'], ['p', 'span']];
        for (let i: number = 0; i < removeAttribute.length; i++) {
            this.RemoveElementNode(removeAttribute[i][0], removeAttribute[i][1]);
        }
    };
    private RemoveElementNode(rmvNode: string, parentNode: string): void {
        let parentArray: NodeListOf<HTMLElement> = this.currentElement.querySelectorAll(parentNode);
        for (let i: number = 0; i < parentArray.length; i++) {
            let rmvArray: NodeListOf<HTMLElement> = parentArray[i].querySelectorAll(rmvNode);
            for (let j: number = rmvArray.length; j > 0; j--) {
                detach(rmvArray[j - 1]);
            }
        }
    };
    private RemoveUnsupported(): void {
        let underlineEle: NodeListOf<HTMLElement> = <NodeListOf<HTMLElement>>this.currentElement.querySelectorAll('u');
        for (let i: number = underlineEle.length - 1; i >= 0; i--) {
            let spanEle: HTMLElement = document.createElement('span');
            spanEle.style.textDecoration = 'underline';
            spanEle.innerHTML = underlineEle[i].innerHTML;
            underlineEle[i].parentNode.insertBefore(spanEle, underlineEle[i]);
            detach(underlineEle[i]);
        }
        let strongEle: NodeListOf<HTMLElement> = this.currentElement.querySelectorAll('strong');
        for (let i: number = strongEle.length - 1; i >= 0; i--) {
            let boldEle: HTMLElement = document.createElement('b');
            boldEle.innerHTML = strongEle[i].innerHTML;
            strongEle[i].parentNode.insertBefore(boldEle, strongEle[i]);
            detach(strongEle[i]);
        }
        let attrArray: string[] = ['language', 'role', 'target', 'contenteditable', 'cellspacing',
            'cellpadding', 'border', 'valign', 'colspan'];
        for (let i: number = 0; i <= attrArray.length; i++) {
            this.RemoveAttributeByName(attrArray[i]);
        }
    };
    private RemoveAttributeByName(attrName: string): void {
        if (this.currentElement.firstChild !== null) {
            if (this.currentElement.firstChild.nodeType !== 3) {
                for (let i: number = 0; i < this.currentElement.childNodes.length; i++) {
                    let ele: Node = this.currentElement.childNodes[i];
                    if (ele.nodeType !== 3 && ele.nodeName !== 'TABLE' && ele.nodeName !== 'TBODY' && ele.nodeName !== 'THEAD' &&
                        ele.nodeName !== 'TH' && ele.nodeName !== 'TR' && ele.nodeName !== 'TD') {
                        if ((ele as HTMLElement).hasAttribute(attrName)) {
                            (ele as HTMLElement).removeAttribute(attrName);
                        }
                        if (ele.hasChildNodes()) {
                            for (let j: number = 0; j < ele.childNodes.length; j++) {
                                let childEle: Node = ele.childNodes[j];
                                if (childEle.nodeType !== 3 && childEle.nodeName !== 'TABLE' && childEle.nodeName !== 'TBODY' &&
                                    childEle.nodeName !== 'THEAD' && childEle.nodeName !== 'TH' && childEle.nodeName !== 'TR' &&
                                    childEle.nodeName !== 'TD' && (childEle as HTMLElement).hasAttribute(attrName)) {
                                    (childEle as HTMLElement).removeAttribute(attrName);
                                }
                                if (childEle.hasChildNodes()) {
                                    for (let k: number = 0; k < childEle.childNodes.length; k++) {
                                        if (childEle.childNodes[k].nodeType !== 3 && childEle.childNodes[k].nodeName !== 'TABLE' &&
                                            childEle.childNodes[k].nodeName !== 'TBODY' && childEle.childNodes[k].nodeName !== 'THEAD' &&
                                            childEle.childNodes[k].nodeName !== 'TH' && childEle.childNodes[k].nodeName !== 'TR'
                                            && childEle.childNodes[k].nodeName !== 'TD'
                                            && (childEle.childNodes[k] as HTMLElement).hasAttribute(attrName)) {
                                            (childEle.childNodes[k] as HTMLElement).removeAttribute(attrName);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}