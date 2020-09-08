// tslint:disable-next-line:max-line-length
import { Component, Property, INotifyPropertyChanged, NotifyPropertyChanges, Event, ModuleDeclaration, ChildProperty, isBlazor, classList, Complex, formatUnit } from '@syncfusion/ej2-base';
import { isNullOrUndefined, L10n, EmitType, Browser } from '@syncfusion/ej2-base';
import { Save } from '@syncfusion/ej2-file-utils';
// tslint:disable-next-line:max-line-length
import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, WStyle, BeforePaneSwitchEventArgs, LayoutType, FormFieldFillEventArgs, FormFieldData } from './index';
import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, CommentDeleteEventArgs, BeforeFileOpenArgs } from './index';
import { LayoutViewer, PageLayoutViewer, WebLayoutViewer, BulletsAndNumberingDialog } from './index';
import { Print, SearchResultsChangeEventArgs } from './index';
import { Page, BodyWidget, ParagraphWidget } from './index';
import { WSectionFormat, WParagraphFormat, WCharacterFormat } from './index';
import { SfdtReader } from './index';
import { Selection } from './index';
import { TextPosition } from './index';
import { Editor, EditorHistory } from './index';
import { WStyles } from './index';
import { HeaderFooters } from './index';
import { Search } from './index';
import { OptionsPane } from './index';
import { WordExport } from './index';
import { TextExport } from './index';
import { FormatType, PageFitType, DialogType, FormattingExceptions } from './index';
import { ContextMenu } from './index';
import { ImageResizer } from './index';
import { SfdtExport } from './index';
import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';
import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';
import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';
import { SpellChecker } from './implementation/spell-check/spell-checker';
import { SpellCheckDialog } from './implementation/dialogs/spellCheck-dialog';
// tslint:disable-next-line:max-line-length
import { DocumentEditorModel, ServerActionSettingsModel, DocumentEditorSettingsModel, FormFieldSettingsModel } from './document-editor-model';
import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties, DocumentHelper } from './index';
import { PasteOptions } from './index';
// tslint:disable-next-line:max-line-length
import { CommentReviewPane, CheckBoxFormFieldDialog, DropDownFormField, TextFormField, CheckBoxFormField, FieldElementBox, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo, ContextElementInfo } from './implementation/index';
import { TextFormFieldDialog } from './implementation/dialogs/form-field-text-dialog';
import { DropDownFormFieldDialog } from './implementation/dialogs/form-field-drop-down-dialog';
import { FormFillingMode, TrackChangeEventArgs, ServiceFailureArgs } from './base';
import { TrackChangesPane } from './implementation/track-changes/track-changes-pane';
import { RevisionCollection } from './implementation/track-changes/track-changes';

/**
 * The `DocumentEditorSettings` module is used to provide the customize property of Document Editor.
 */
export class DocumentEditorSettings extends ChildProperty<DocumentEditorSettings> {
    /**
     * Specifies the user preferred Search Highlight Color of Document Editor.
     * @default '#FFE97F'
     */
    @Property('#FFE97F')
    public searchHighlightColor: string;

    /* tslint:disable */
    /**
     * Specifies the user preferred font family of Document Editor.
     * @default ['Algerian','Arial','Calibri','Cambria','CambriaMath','Candara','CourierNew','Georgia','Impact','SegoePrint','SegoeScript','SegoeUI','Symbol','TimesNewRoman','Verdana','Windings']
     */
    @Property(['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Courier New', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Windings'])
    public fontFamilies: string[];
    /* tslint:enable */


    /**
     * Form field settings.
     */
    @Property({ shadingColor: '#cfcfcf', applyShading: true, selectionColor: '#cccccc', formFillingMode: 'Popup' })
    public formFieldSettings: FormFieldSettingsModel;
}

/**
 * The Document editor component is used to draft, save or print rich text contents as page by page.
 */
@NotifyPropertyChanges
export class DocumentEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    private enableHeaderFooterIn: boolean = false;
    /**
     * @private
     */
    get enableHeaderAndFooter(): boolean {
        return this.enableHeaderFooterIn;
    }
    set enableHeaderAndFooter(value: boolean) {
        this.enableHeaderFooterIn = value;
        if (!value && this.selection && this.selection.isWebLayout) {
            this.selection.isWebLayout = false;
        }
        this.viewer.updateScrollBars();
    }
    /**
     * @private
     */
    public viewer: LayoutViewer;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    /**
     * @private
     */
    public isShiftingEnabled: boolean = false;
    /**
     * @private
     */
    public isLayoutEnabled: boolean = true;
    /**
     * @private
     */
    public isPastingContent: boolean = false;
    /**
     * @private
     */
    public parser: SfdtReader = undefined;
    private isDocumentLoadedIn: boolean;
    private disableHistoryIn: boolean = false;
    /**
     * @private
     */
    public findResultsList: string[] = undefined;
    //Module Declaration
    /**
     * @private
     */
    public printModule: Print;
    /**
     * @private
     */
    public sfdtExportModule: SfdtExport;
    /**
     * @private
     */
    public selectionModule: Selection;
    /**
     * @private
     */
    public editorModule: Editor;
    /**
     * @private
     */
    public wordExportModule: WordExport;
    /**
     * @private
     */
    public textExportModule: TextExport;
    /**
     * @private
     */
    public editorHistoryModule: EditorHistory;
    /**
     * @private
     */
    public tableOfContentsDialogModule: TableOfContentsDialog;
    /**
     * @private
     */
    public tablePropertiesDialogModule: TablePropertiesDialog = undefined;
    /**
     * @private
     */
    public bordersAndShadingDialogModule: BordersAndShadingDialog = undefined;
    /**
     * @private
     */
    public listDialogModule: ListDialog;
    /**
     * @private
     */
    public styleDialogModule: StyleDialog;
    /**
     * @private
     */
    public cellOptionsDialogModule: CellOptionsDialog = undefined;
    /**
     * @private
     */
    public tableOptionsDialogModule: TableOptionsDialog = undefined;
    /**
     * @private
     */
    public tableDialogModule: TableDialog;
    /**
     * @private
     */
    public spellCheckDialogModule: SpellCheckDialog;
    /**
     * @private
     */
    public pageSetupDialogModule: PageSetupDialog;
    /**
     * @private
     */
    public paragraphDialogModule: ParagraphDialog = undefined;
    /**
     * @private
     */
    public checkBoxFormFieldDialogModule: CheckBoxFormFieldDialog;
    /**
     * @private
     */
    public textFormFieldDialogModule: TextFormFieldDialog;
    /**
     * @private
     */
    public dropDownFormFieldDialogModule: DropDownFormFieldDialog;
    /**
     * @private
     */
    public optionsPaneModule: OptionsPane;
    /**
     * @private
     */
    public hyperlinkDialogModule: HyperlinkDialog;
    /**
     * @private
     */
    public bookmarkDialogModule: BookmarkDialog;
    /**
     * @private
     */
    public stylesDialogModule: StylesDialog;
    /**
     * @private
     */
    public contextMenuModule: ContextMenu;
    /**
     * @private
     */
    public imageResizerModule: ImageResizer = undefined;
    /**
     * @private
     */
    public searchModule: Search;
    /**
     * Default Paste Formatting Options
     * @default KeepSourceFormatting
     */
    @Property('KeepSourceFormatting')
    public defaultPasteOption: PasteOptions;

    /**
     * Layout Type
     * @default Pages
     */
    @Property('Pages')
    public layoutType: LayoutType;

    /**
     * Current User
     * @default ''
     */
    @Property('')
    public currentUser: string;

    /**
     * User Selection Highlight Color
     * @default '#FFFF00'
     */
    @Property('#FFFF00')
    public userColor: string;

    /**
     * Gets or sets the page gap value in document editor
     * @default 20
     */
    @Property(20)
    public pageGap: number;
    /**
     * Gets or sets the name of the document.
     * @default ''
     */
    @Property('')
    public documentName: string;
    /**
     * @private
     */
    public spellCheckerModule: SpellChecker;
    /**
     * Defines the width of the DocumentEditor component 
     * @default '100%'
     */
    @Property('100%')
    public width: string;
    /**
     * Defines the height of the DocumentEditor component 
     * @default '200px'
     */
    @Property('200px')
    public height: string;
    /**
     * Sfdt Service URL
     * @default ''
     */
    @Property('')
    public serviceUrl: string;
    // Public Implementation Starts
    /**
     * Gets or sets the zoom factor in document editor.
     * @default 1
     */
    @Property(1)
    public zoomFactor: number;
    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     * @default 2000
     * @aspType int
     */
    @Property(2000)
    public zIndex: number;
    /**
     * Gets or sets a value indicating whether the document editor is in read only state or not.
     * @default true
     */
    @Property(true)
    public isReadOnly: boolean;
    /**
     * Gets or sets a value indicating whether print needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enablePrint: boolean;
    /**
     * Gets or sets a value indicating whether selection needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableSelection: boolean;
    /**
     * Gets or sets a value indicating whether editor needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableEditor: boolean;
    /**
     * Gets or sets a value indicating whether editor history needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableEditorHistory: boolean;
    /**
     * Gets or sets a value indicating whether Sfdt export needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableSfdtExport: boolean;
    /**
     * Gets or sets a value indicating whether word export needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableWordExport: boolean;
    /**
     * Gets or sets a value indicating whether text export needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableTextExport: boolean;
    /**
     * Gets or sets a value indicating whether options pane is enabled or not.
     * @default false
     */
    @Property(false)
    public enableOptionsPane: boolean;
    /**
     * Gets or sets a value indicating whether context menu is enabled or not.
     * @default false
     */
    @Property(false)
    public enableContextMenu: boolean;
    /**
     * Gets or sets a value indicating whether hyperlink dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableHyperlinkDialog: boolean;
    /**
     * Gets or sets a value indicating whether bookmark dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableBookmarkDialog: boolean;
    /**
     * Gets or sets a value indicating whether table of contents dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableTableOfContentsDialog: boolean;
    /**
     * Gets or sets a value indicating whether search module is enabled or not.
     * @default false
     */
    @Property(false)
    public enableSearch: boolean;
    /**
     * Gets or sets a value indicating whether paragraph dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableParagraphDialog: boolean;
    /**
     * Gets or sets a value indicating whether list dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableListDialog: boolean;
    /**
     * Gets or sets a value indicating whether table properties dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableTablePropertiesDialog: boolean;
    /**
     * Gets or sets a value indicating whether borders and shading dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableBordersAndShadingDialog: boolean;
    /**
     * Gets or sets a value indicating whether margin dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enablePageSetupDialog: boolean;
    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableStyleDialog: boolean;
    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableFontDialog: boolean;
    /**
     * @private
     */
    public fontDialogModule: FontDialog;
    /**
     * Gets or sets a value indicating whether table options dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableTableOptionsDialog: boolean;
    /**
     * Gets or sets a value indicating whether table dialog is enabled or not.
     * @default false
     */
    @Property(false)
    public enableTableDialog: boolean;
    /**
     * Gets or sets a value indicating whether image resizer is enabled or not.
     * @default false
     */
    @Property(false)
    public enableImageResizer: boolean;
    /**
     * Gets or sets a value indicating whether editor need to be spell checked.
     * @default false
     */
    @Property(false)
    public enableSpellCheck: boolean;
    /**
     * Gets or set a value indicating whether comment is enabled or not
     * @default false
     */
    @Property(false)
    public enableComment: boolean;
    /**
     * Gets or set a value indicating whether track changes is enabled or not
     * @default false
     */
    @Property(false)
    public enableTrackChanges: boolean;
    /**
     * Gets or set a value indicating whether form fields is enabled or not.
     * @default false
     */
    @Property(true)
    public enableFormField: boolean;
    /**
     * Gets or Sets a value indicating whether tab key can be accepted as input or not.
     * @default false
     */
    @Property(false)
    public acceptTab: boolean;
    /**
     * Gets or Sets a value indicating whether holding Ctrl key is required to follow hyperlink on click. The default value is true.
     * @default true
     */
    @Property(true)
    public useCtrlClickToFollowHyperlink: boolean;
    /**
     * Gets or sets the page outline color.
     * @default '#000000'
     */
    @Property('#000000')
    public pageOutline: string;
    /**
     * Gets or sets a value indicating whether to enable cursor in document editor on read only state or not. The default value is false.
     * @default false
     */
    @Property(false)
    public enableCursorOnReadOnly: boolean;
    /**
     * Gets or sets a value indicating whether local paste needs to be enabled or not.
     * @default false
     */
    @Property(false)
    public enableLocalPaste: boolean;
    /**
     * Defines the settings for DocumentEditor customization.
     * @default {}
     */
    @Complex<DocumentEditorSettingsModel>({}, DocumentEditorSettings)
    public documentEditorSettings: DocumentEditorSettingsModel;
    /**
     * Defines the settings of the DocumentEditor services
     */
    // tslint:disable-next-line:max-line-length
    @Property({ systemClipboard: 'SystemClipboard', spellCheck: 'SpellCheck', restrictEditing: 'RestrictEditing' })
    public serverActionSettings: ServerActionSettingsModel;

    /**
     * Add custom headers to XMLHttpRequest.
     * @default []
     */
    @Property([])
    public headers: object[];
    /**
     * Show comment in the document.
     * @default false
     */
    @Property(false)
    public showComments: boolean;
    /**
     * Shows revision changes in the document.
     * @default false
     */
    @Property(false)
    public showRevisions: boolean;

    /**
     * Triggers whenever document changes in the document editor.
     * @event
     * @blazorproperty 'DocumentChanged'
     */
    @Event()
    public documentChange: EmitType<DocumentChangeEventArgs>;
    /**
     * Triggers whenever container view changes in the document editor.
     * @event
     * @blazorproperty 'ViewChanged'
     */
    @Event()
    public viewChange: EmitType<ViewChangeEventArgs>;
    /**
     * Triggers whenever zoom factor changes in the document editor.
     * @event
     * @blazorproperty 'ZoomFactorChanged'
     */
    @Event()
    public zoomFactorChange: EmitType<ZoomFactorChangeEventArgs>;
    /**
     * Triggers whenever selection changes in the document editor.
     * @event
     * @blazorproperty 'SelectionChanged'
     */
    @Event()
    public selectionChange: EmitType<SelectionChangeEventArgs>;
    /**
     * Triggers whenever hyperlink is clicked or tapped in the document editor.
     * @event
     * @blazorproperty 'OnRequestNavigate'
     */
    @Event()
    public requestNavigate: EmitType<RequestNavigateEventArgs>;
    /**
     * Triggers whenever content changes in the document editor.
     * @event
     * @blazorproperty 'ContentChanged'
     */
    @Event()
    public contentChange: EmitType<ContentChangeEventArgs>;
    /**
     * Triggers whenever key is pressed in the document editor.
     * @event
     * @blazorproperty 'OnKeyDown'
     */
    @Event()
    public keyDown: EmitType<DocumentEditorKeyDownEventArgs>;
    /**
     * Triggers whenever search results changes in the document editor.
     * @event
     * @blazorproperty 'SearchResultsChanged'
     */
    @Event()
    public searchResultsChange: EmitType<SearchResultsChangeEventArgs>;
    /**
     * Triggers when the component is created
     * @event
     * @blazorproperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     * @event
     * @blazorproperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Triggers while selecting the custom context-menu option.
     * @event
     * @blazorproperty 'ContextMenuItemSelected'
     */
    @Event()
    public customContextMenuSelect: EmitType<CustomContentMenuEventArgs>;
    /**
     * Triggers before opening the custom context-menu option.
     * @event
     * @blazorproperty 'OnContextMenuOpen'
     */
    @Event()
    public customContextMenuBeforeOpen: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;
    /**
     * Triggers before opening comment pane.
     * @event
     * @blazorproperty 'BeforePaneSwitch'
     */
    @Event()
    public beforePaneSwitch: EmitType<BeforePaneSwitchEventArgs>;
    /**
     * Triggers after inserting comment.
     * @blazorproperty 'OnCommentBegin'
     * @event
     */
    @Event()
    public commentBegin: EmitType<Object>;
    /**
     * Triggers after posting comment.
     * @event
     * @blazorproperty 'AfterCommentEnd'
     */
    @Event()
    public commentEnd: EmitType<Object>;
    /**
     * Triggers before a file is opened.
     * @event
     * @blazorproperty 'onBeforeFileOpen'
     */
    @Event()
    public beforeFileOpen: EmitType<BeforeFileOpenArgs>;
    /**
     * Triggers after inserting comment.
     * @blazorproperty 'OnCommentDelete'
     * @event
     */
    @Event()
    public commentDelete: EmitType<CommentDeleteEventArgs>;
    /**
     * Triggers when TrackChanges enabled / disabled.
     * @blazorproperty 'OnTrackChange'
     * @event
     */
    @Event()
    public trackChange: EmitType<TrackChangeEventArgs>;
    /**
     * Triggers before form field fill.
     * @event
     */
    @Event()
    public beforeFormFieldFill: EmitType<FormFieldFillEventArgs>;
    /**
     * Triggers when the server side action fails.
     * @event
     */
    @Event()
    public serviceFailure: EmitType<ServiceFailureArgs>;

    /**
     * Triggers after form field fill.
     * @event
     */
    @Event()
    public afterFormFieldFill: EmitType<FormFieldFillEventArgs>;

    /**
     * @private
     */
    public characterFormat: CharacterFormatProperties;
    /**
     * @private
     */
    public paragraphFormat: ParagraphFormatProperties;
    /**
     * @private
     */
    public sectionFormat: SectionFormatProperties;
    /**
     * @private
     */
    public commentReviewPane: CommentReviewPane;
    /**
     * @private
     */
    public trackChangesPane: TrackChangesPane;
    /**
     * @private
     */
    public revisionsInternal: RevisionCollection;
    /**
     * Gets the total number of pages.
     * @blazorType int
     * @returns {number}
     */
    public get pageCount(): number {
        if (!this.isDocumentLoaded || isNullOrUndefined(this.viewer) || this.viewer instanceof WebLayoutViewer) {
            return 1;
        }
        return this.documentHelper.pages.length;
    }
    /**
     *  Gets the selection object of the document editor.
     * @aspType Selection
     * @blazorType Selection
     * @returns {Selection}
     * @default undefined
     */
    public get selection(): Selection {
        return this.selectionModule;
    }
    /**
     *  Gets the editor object of the document editor.
     * @aspType Editor
     * @blazorType Editor
     * @returns {Editor}
     * @default undefined
     */
    public get editor(): Editor {
        return this.editorModule;
    }
    /** 
     * Gets the editor history object of the document editor.
     * @aspType EditorHistory
     * @blazorType EditorHistory
     * @returns {EditorHistory}
     */
    public get editorHistory(): EditorHistory {
        return this.editorHistoryModule;
    }
    /** 
     * Gets the search object of the document editor.
     * @aspType Search
     * @blazorType Search
     * @returns { Search }
     */
    public get search(): Search {
        return this.searchModule;
    }
    /**
     * Gets the context menu object of the document editor.
     * @aspType ContextMenu
     * @blazorType ContextMenu
     * @returns {ContextMenu}
     */
    public get contextMenu(): ContextMenu {
        return this.contextMenuModule;
    }
    /**
     * Gets the spell check dialog object of the document editor.
     * @returns SpellCheckDialog
     */
    get spellCheckDialog(): SpellCheckDialog {
        return this.spellCheckDialogModule;
    }
    /**
     * Gets the spell check object of the document editor.
     * @aspType SpellChecker
     * @blazorType SpellChecker
     * @returns SpellChecker
     */
    public get spellChecker(): SpellChecker {
        return this.spellCheckerModule;
    }
    /**
     * @private
     */
    get containerId(): string {
        return this.element.id;
    }
    /**
     * @private
     */
    get isDocumentLoaded(): boolean {
        return this.isDocumentLoadedIn;
    }
    set isDocumentLoaded(value: boolean) {
        this.isDocumentLoadedIn = value;
    }
    /**
     * Gets the revision collection which contains information about changes made from original document
     */
    public get revisions(): RevisionCollection {
        if (isNullOrUndefined(this.revisionsInternal)) {
            this.revisionsInternal = new RevisionCollection(this);
        }
        return this.revisionsInternal;
    }
    /**
     * Determines whether history needs to be enabled or not.
     * @default - false
     * @private
     */
    get enableHistoryMode(): boolean {
        return this.enableEditorHistory && !isNullOrUndefined(this.editorHistoryModule);
    }
    /**
     * Gets the start text position in the document.
     * @default undefined
     * @private
     */
    get documentStart(): TextPosition {
        if (!isNullOrUndefined(this.selectionModule)) {
            return this.selection.getDocumentStart();
        }
        return undefined;
    }
    /**
     * Gets the end text position in the document.
     * @default undefined
     * @private
     */
    get documentEnd(): TextPosition {
        if (!isNullOrUndefined(this.selectionModule)) {
            return this.selection.getDocumentEnd();
        }
        return undefined;
    }
    /**
     * @private
     */
    get isReadOnlyMode(): boolean {
        return this.isReadOnly || isNullOrUndefined(this.editorModule)
            || isNullOrUndefined(this.selectionModule) || !isNullOrUndefined(this.editor) && this.editor.restrictEditing;
    }
    /**
     * @private
     */
    get isSpellCheck(): boolean {
        return this.enableSpellCheck && this.spellChecker.enableSpellCheck;
    }
    /**
     * Specifies to enable image resizer option
     * default - false
     * @private
     */
    get enableImageResizerMode(): boolean {
        return this.enableImageResizer && !isNullOrUndefined(this.imageResizerModule);
    }
    /** 
     * Initialize the constructor of DocumentEditor
     */
    constructor(options?: DocumentEditorModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.documentHelper = new DocumentHelper(this);
        if (this.layoutType === 'Pages') {
            this.viewer = new PageLayoutViewer(this);
        } else {
            this.viewer = new WebLayoutViewer(this);
        }
        this.parser = new SfdtReader(this.documentHelper);
    }
    protected preRender(): void {
        //pre render section
        this.findResultsList = [];
    }
    protected render(): void {
        if (!isNullOrUndefined(this.element)) {
            let container: HTMLElement = this.element;
            container.style.minHeight = '200px';
            container.style.minWidth = '200px';
            if (this.height !== '') {
                this.element.style.height = formatUnit(this.height);
            }
            if (this.width !== '') {
                this.element.style.width = formatUnit(this.width);
            }
        }
        this.documentHelper.initializeComponents();
        this.openBlank();
        this.renderComplete();
    }
    /**
     * Get component name
     * @private
     */
    public getModuleName(): string {
        return 'DocumentEditor';
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    public onPropertyChanged(model: DocumentEditorModel, oldProp: DocumentEditorModel): void {
        for (let prop of Object.keys(model)) {
            switch (prop) {
                case 'zoomFactor':
                    if (this.viewer) {
                        this.documentHelper.zoomFactor = model.zoomFactor;
                    }
                    break;
                case 'layoutType':
                    if (this.selection && this.selection.isWebLayout) {
                        break;
                    }
                    this.viewer.destroy();
                    if (this.layoutType === 'Pages') {
                        this.viewer = new PageLayoutViewer(this);
                    } else {
                        if (this.enableHeaderAndFooter === true) {
                            this.selection.closeHeaderFooter();
                        }
                        this.viewer = new WebLayoutViewer(this);
                    }
                    this.editor.layoutWholeDocument(true);
                    setTimeout((): void => { this.fireViewChange(); }, 200);
                    break;
                case 'locale':
                    this.localizeDialogs();
                    break;
                case 'isReadOnly':
                    if (!isNullOrUndefined(this.optionsPaneModule) && this.optionsPaneModule.isOptionsPaneShow) {
                        this.optionsPaneModule.showHideOptionsPane(false);
                    }
                    if (this.showComments) {
                        this.commentReviewPane.showHidePane(true, 'Comments');
                    }
                    break;
                case 'currentUser':
                case 'userColor':
                    if (this.selection && this.documentHelper.isDocumentProtected) {
                        this.selection.highlightEditRegion();
                    }
                    break;
                case 'pageGap':
                case 'pageOutline':
                    this.viewer.updateScrollBars();
                    break;
                case 'zIndex':
                    if (this.documentHelper.dialog) {
                        this.documentHelper.dialog.zIndex = model.zIndex + 10;
                    }
                    if (this.documentHelper.dialog2) {
                        this.documentHelper.dialog2.zIndex = model.zIndex;
                    }
                    break;
                case 'showComments':
                    if (this.viewer) {
                        this.documentHelper.showComments(model.showComments);
                    }
                    break;
                case 'enableRtl':
                    this.localizeDialogs(model.enableRtl);
                    break;
                case 'enableComment':
                    if (this.viewer && this.showComments) {
                        this.showComments = this.showComments ? this.enableComment : false;
                        this.documentHelper.showComments(model.enableComment);
                    }
                    this.viewer.updateScrollBars();
                    break;
                case 'showRevisions':
                    if (this.viewer) {
                        this.documentHelper.showRevisions(model.showRevisions);
                    }
                    this.viewer.updateScrollBars();
                    break;
                case 'documentEditorSettings':
                    this.viewer.updateScrollBars();
                    break;
                case 'height':
                    this.element.style.height = formatUnit(this.height);
                    this.resize();
                    break;
                case 'width':
                    this.element.style.width = formatUnit(this.width);
                    this.resize();
                    break;
            }
        }
    }
    private localizeDialogs(enableRtl?: boolean): void {
        if (this.locale !== '') {
            let l10n: L10n = new L10n('documenteditor', this.defaultLocale);
            l10n.setLocale(this.locale);
            if (!isNullOrUndefined(enableRtl)) {
                this.documentHelper.dialog.enableRtl = enableRtl;
                this.documentHelper.dialog2.enableRtl = enableRtl;
            }
            if (this.optionsPaneModule) {
                this.optionsPaneModule.initOptionsPane(l10n, enableRtl);
            }
            if (this.paragraphDialogModule) {
                this.paragraphDialogModule.initParagraphDialog(l10n);
            }
            if (this.pageSetupDialogModule) {
                this.pageSetupDialogModule.initPageSetupDialog(l10n, enableRtl);
            }
            if (this.fontDialogModule) {
                this.fontDialogModule.initFontDialog(l10n, enableRtl);
            }
            if (this.hyperlinkDialogModule) {
                this.hyperlinkDialogModule.initHyperlinkDialog(l10n, enableRtl);
            }
            if (this.contextMenuModule) {
                this.contextMenuModule.contextMenuInstance.destroy();
                this.contextMenuModule.initContextMenu(l10n, enableRtl);
            }
            if (this.listDialogModule) {
                this.listDialogModule.initListDialog(l10n, enableRtl);
            }
            if (this.tablePropertiesDialogModule) {
                this.tablePropertiesDialogModule.initTablePropertyDialog(l10n, enableRtl);
            }
            if (this.bordersAndShadingDialogModule) {
                this.bordersAndShadingDialogModule.initBordersAndShadingsDialog(l10n, enableRtl);
            }
            if (this.cellOptionsDialogModule) {
                this.cellOptionsDialogModule.initCellMarginsDialog(l10n, enableRtl);
            }
            if (this.tableOptionsDialogModule) {
                this.tableOptionsDialogModule.initTableOptionsDialog(l10n, enableRtl);
            }
            if (this.tableDialogModule) {
                this.tableDialogModule.initTableDialog(l10n);
            }
            if (this.styleDialogModule) {
                this.styleDialogModule.initStyleDialog(l10n, enableRtl);
            }
            if (this.tableOfContentsDialogModule) {
                this.tableOfContentsDialogModule.initTableOfContentDialog(l10n, enableRtl);
            }
            if (this.commentReviewPane && this.commentReviewPane.parentPaneElement) {
                if (this.enableRtl) {
                    classList(this.commentReviewPane.parentPaneElement, ['e-rtl'], []);
                } else {
                    classList(this.commentReviewPane.parentPaneElement, [], ['e-rtl']);
                }
            }
        }
    }
    /**
     * Set the default character format for document editor 
     * @param characterFormat
     */
    public setDefaultCharacterFormat(characterFormat: CharacterFormatProperties): void {
        this.characterFormat = characterFormat;
    }

    /**
     * Set the default paragraph format for document editor
     * @param paragraphFormat 
     */
    public setDefaultParagraphFormat(paragraphFormat: ParagraphFormatProperties): void {
        this.paragraphFormat = paragraphFormat;
    }

    /**
     * Set the default section format for document editor
     * @param sectionFormat 
     */
    public setDefaultSectionFormat(sectionFormat: SectionFormatProperties): void {
        this.sectionFormat = sectionFormat;
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        return 'documenteditor';
    }
    private clearPreservedCollectionsInViewer(): void {
        if (this.viewer instanceof LayoutViewer) {
            this.documentHelper.clearDocumentItems();
        }
    }
    /**
     * @private
     */
    public getDocumentEditorElement(): HTMLElement {
        return this.element as HTMLElement;
    }
    /**
     * @private
     */
    public fireContentChange(): void {
        let eventArgs: ContentChangeEventArgs = { source: isBlazor() ? null : this };
        this.trigger('contentChange', eventArgs);
    }
    /**
     * @private
     */
    public fireDocumentChange(): void {
        let eventArgs: DocumentChangeEventArgs = { source: isBlazor() ? null : this };
        this.trigger('documentChange', eventArgs);
    }
    /**
     * @private
     */
    public fireSelectionChange(): void {
        if (!this.documentHelper.isCompositionStart && Browser.isDevice && this.editorModule) {
            this.editorModule.predictText();
        }
        let eventArgs: SelectionChangeEventArgs = { source: isBlazor() ? null : this };
        this.trigger('selectionChange', eventArgs);
    }
    /**
     * @private
     */
    public fireZoomFactorChange(): void {
        let eventArgs: ZoomFactorChangeEventArgs = { source: isBlazor() ? null : this };
        this.trigger('zoomFactorChange', eventArgs);
    }
    /**
     * @private
     */
    public fireBeformFieldFill(): void {
        let eventArgs: FormFieldFillEventArgs = {};
        this.trigger('beforeFieldFill', eventArgs);
    }
    /**
     * @private
     */
    public fireAfterFormFieldFill(): void {
        let eventArgs: FormFieldFillEventArgs = {};
        this.trigger('afterFieldFill', eventArgs);
    }
    /**
     * @private
     */
    public fireServiceFailure(eventArgs: ServiceFailureArgs): void {
        this.trigger('serviceFailure', eventArgs);
    }
    /**
     * @private
     */

    public fireViewChange(): void {
        if (this.viewer && this.documentHelper.pages.length > 0) {
            if ((this.viewer as PageLayoutViewer).visiblePages.length > 0) {
                let pages: Page[] = (this.viewer as PageLayoutViewer).visiblePages;
                let eventArgs: ViewChangeEventArgs = {
                    startPage: pages[0].index + 1,
                    endPage: pages[pages.length - 1].index + 1,
                    source: isBlazor() ? null : this
                };
                this.trigger('viewChange', eventArgs);
            }
        }
    }
    /**
     * @private
     */
    public fireCustomContextMenuSelect(item: string): void {
        let eventArgs: CustomContentMenuEventArgs = { id: item };
        this.trigger('customContextMenuSelect', eventArgs);
    }
    /**
     * @private
     */
    public fireCustomContextMenuBeforeOpen(item: string[]): void {
        let eventArgs: BeforeOpenCloseCustomContentMenuEventArgs = { ids: item };
        this.trigger('customContextMenuBeforeOpen', eventArgs);
    }
    /**
     * Shows the Paragraph dialog
     * @private
     */
    public showParagraphDialog(paragraphFormat?: WParagraphFormat): void {
        if (this.paragraphDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.paragraphDialogModule.show(paragraphFormat);
        }
    }
    /**
     * Shows the margin dialog
     * @private
     */
    public showPageSetupDialog(): void {
        if (this.pageSetupDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.pageSetupDialogModule.show();
        }
    }
    /**
     * Shows the font dialog
     * @private
     */
    public showFontDialog(characterFormat?: WCharacterFormat): void {
        if (this.fontDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.fontDialogModule.showFontDialog(characterFormat);
        }
    }
    /**
     * Shows the cell option dialog
     * @private
     */
    public showCellOptionsDialog(): void {
        if (this.cellOptionsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.cellOptionsDialogModule.show();
        }
    }
    /**
     * Shows the table options dialog.
     * @private
     */
    public showTableOptionsDialog(): void {
        if (this.tableOptionsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableOptionsDialogModule.show();
        }
    }
    /**
     * Shows insert table dialog
     * @private
     */
    public showTableDialog(): void {
        if (this.tableDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableDialogModule.show();
        }
    }
    /**
     * Shows the table of content dialog
     * @private
     */
    public showTableOfContentsDialog(): void {
        if (this.tableOfContentsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableOfContentsDialogModule.show();
        }
    }
    /**
     * Shows the style dialog
     * @private
     */
    public showStyleDialog(): void {
        if (this.styleDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.styleDialogModule.show();
        }
    }
    /**
     * Shows the hyperlink dialog
     * @private
     */
    public showHyperlinkDialog(): void {
        if (this.hyperlinkDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.hyperlinkDialogModule.show();
        }
    }
    /**
     * Shows the bookmark dialog.
     * @private
     */
    public showBookmarkDialog(): void {
        if (this.bookmarkDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.bookmarkDialogModule.show();
        }
    }
    /**
     * Shows the styles dialog.
     * @private
     */
    public showStylesDialog(): void {
        if (this.stylesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.stylesDialogModule.show();
        }
    }
    /**
     * Shows the List dialog
     * @private
     */
    public showListDialog(): void {
        if (this.listDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.listDialogModule.showListDialog();
        }
    }
    /**
     * Shows the table properties dialog
     * @private
     */
    public showTablePropertiesDialog(): void {
        if (this.tablePropertiesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tablePropertiesDialogModule.show();
        }
    }
    /**
     * Shows the borders and shading dialog
     * @private
     */
    public showBordersAndShadingDialog(): void {
        if (this.bordersAndShadingDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.bordersAndShadingDialogModule.show();
        }
    }
    //tslint:disable: max-func-body-length
    protected requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.enablePrint) {
            modules.push({
                member: 'Print', args: []
            });
        }
        if (this.enableSfdtExport || this.enableWordExport || this.enableTextExport || this.enableSelection || this.enableEditor) {
            modules.push({
                member: 'SfdtExport', args: [this.documentHelper]
            });
        }
        if (this.enableWordExport) {
            modules.push({
                member: 'WordExport', args: []
            });
        }
        if (this.enableTextExport) {
            modules.push({
                member: 'TextExport', args: []
            });
        }
        if (this.enableSelection || this.enableSearch || this.enableEditor) {
            modules.push({
                member: 'Selection', args: [this]
            });
            if (this.enableContextMenu) {
                modules.push({
                    member: 'ContextMenu', args: [this.documentHelper]
                });
            }
        }
        if (this.enableSearch) {
            modules.push({
                member: 'Search', args: [this]
            });
            if (this.enableOptionsPane) {
                modules.push({
                    member: 'OptionsPane', args: [this.documentHelper]
                });
            }
        }
        if (this.enableEditor) {
            modules.push({
                member: 'Editor', args: [this.documentHelper]
            });
            if (this.enableImageResizer) {
                modules.push({
                    member: 'ImageResizer', args: [this, this.documentHelper]
                });
            }
            if (this.enableEditorHistory) {
                modules.push({
                    member: 'EditorHistory', args: [this]
                });
            }
            if (this.enableHyperlinkDialog) {
                modules.push({
                    member: 'HyperlinkDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTableDialog) {
                modules.push({
                    member: 'TableDialog', args: [this.documentHelper]
                });
            }
            if (this.enableBookmarkDialog) {
                modules.push({
                    member: 'BookmarkDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTableOfContentsDialog) {
                modules.push({
                    member: 'TableOfContentsDialog', args: [this.documentHelper]
                });
            }
            if (this.enablePageSetupDialog) {
                modules.push({
                    member: 'PageSetupDialog', args: [this.documentHelper]
                });
            }
            if (this.enableStyleDialog) {
                modules.push({
                    member: 'StylesDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'StyleDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'BulletsAndNumberingDialog', args: [this.documentHelper]
                });
            }
            if (this.enableListDialog) {
                modules.push({
                    member: 'ListDialog', args: [this.documentHelper]
                });
            }
            if (this.enableParagraphDialog) {
                modules.push({
                    member: 'ParagraphDialog', args: [this.documentHelper]
                });
            }
            if (this.enableFontDialog) {
                modules.push({
                    member: 'FontDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTablePropertiesDialog) {
                modules.push({
                    member: 'TablePropertiesDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'CellOptionsDialog', args: [this.documentHelper]
                });
            }
            if (this.enableBordersAndShadingDialog) {
                modules.push({
                    member: 'BordersAndShadingDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTableOptionsDialog) {
                modules.push({
                    member: 'TableOptionsDialog', args: [this.documentHelper]
                });
            }
            if (this.enableSpellCheck) {
                modules.push({
                    member: 'SpellChecker', args: [this.documentHelper]
                });
                modules.push({
                    member: 'SpellCheckDialog', args: [this.documentHelper]
                });
            }
            if (this.enableFormField) {
                modules.push({
                    member: 'TextFormFieldDialog', args: [this]
                });
                modules.push({
                    member: 'DropDownFormFieldDialog', args: [this]
                });
                modules.push({
                    member: 'CheckBoxFormFieldDialog', args: [this]
                });
            }
        }
        return modules;
    }
    /**
     * @private
     */
    public defaultLocale: Object = {
        'Table': 'Table',
        'Row': 'Row',
        'Cell': 'Cell',
        'Ok': 'OK',
        'Cancel': 'Cancel',
        'Size': 'Size',
        'Preferred Width': 'Preferred width',
        'Points': 'Points',
        'Percent': 'Percent',
        'Measure in': 'Measure in',
        'Alignment': 'Alignment',
        'Left': 'Left',
        'Center': 'Center',
        'Right': 'Right',
        'Justify': 'Justify',
        'Indent from left': 'Indent from left',
        'Borders and Shading': 'Borders and Shading',
        'Options': 'Options',
        'Specify height': 'Specify height',
        'At least': 'At least',
        'Exactly': 'Exactly',
        'Row height is': 'Row height is',
        'Allow row to break across pages': 'Allow row to break across pages',
        'Repeat as header row at the top of each page': 'Repeat as header row at the top of each page',
        'Vertical alignment': 'Vertical alignment',
        'Top': 'Top',
        'Bottom': 'Bottom',
        'Default cell margins': 'Default cell margins',
        'Default cell spacing': 'Default cell spacing',
        'Allow spacing between cells': 'Allow spacing between cells',
        'Cell margins': 'Cell margins',
        'Same as the whole table': 'Same as the whole table',
        'Borders': 'Borders',
        'None': 'None',
        'Style': 'Style',
        'Width': 'Width',
        'Height': 'Height',
        'Letter': 'Letter',
        'Tabloid': 'Tabloid',
        'Legal': 'Legal',
        'Statement': 'Statement',
        'Executive': 'Executive',
        'A3': 'A3',
        'A4': 'A4',
        'A5': 'A5',
        'B4': 'B4',
        'B5': 'B5',
        'Custom Size': 'Custom size',
        'Different odd and even': 'Different odd and even',
        'Different first page': 'Different first page',
        'From edge': 'From edge',
        'Header': 'Header',
        'Footer': 'Footer',
        'Margin': 'Margins',
        'Paper': 'Paper',
        'Layout': 'Layout',
        'Orientation': 'Orientation',
        'Landscape': 'Landscape',
        'Portrait': 'Portrait',
        'Show page numbers': 'Show page numbers',
        'Right align page numbers': 'Right align page numbers',
        'Nothing': 'Nothing',
        'Tab leader': 'Tab leader',
        'Show levels': 'Show levels',
        'Use hyperlinks instead of page numbers': 'Use hyperlinks instead of page numbers',
        'Build table of contents from': 'Build table of contents from',
        'Styles': 'Styles',
        'Available styles': 'Available styles',
        'TOC level': 'TOC level',
        'Heading': 'Heading',
        'Heading 1': 'Heading 1',
        'Heading 2': 'Heading 2',
        'Heading 3': 'Heading 3',
        'Heading 4': 'Heading 4',
        'Heading 5': 'Heading 5',
        'Heading 6': 'Heading 6',
        'List Paragraph': 'List Paragraph',
        'Normal': 'Normal',
        'Outline levels': 'Outline levels',
        'Table entry fields': 'Table entry fields',
        'Modify': 'Modify',
        'Color': 'Color',
        'Setting': 'Setting',
        'Box': 'Box',
        'All': 'All',
        'Custom': 'Custom',
        'Preview': 'Preview',
        'Shading': 'Shading',
        'Fill': 'Fill',
        'Apply To': 'Apply to',
        'Table Properties': 'Table Properties',
        'Cell Options': 'Cell Options',
        'Table Options': 'Table Options',
        'Insert Table': 'Insert Table',
        'Number of columns': 'Number of columns',
        'Number of rows': 'Number of rows',
        'Text to display': 'Text to display',
        'Address': 'Address',
        'Insert Hyperlink': 'Insert Hyperlink',
        'Edit Hyperlink': 'Edit Hyperlink',
        'Insert': 'Insert',
        'General': 'General',
        'Indentation': 'Indentation',
        'Before text': 'Before text',
        'Special': 'Special',
        'First line': 'First line',
        'Hanging': 'Hanging',
        'After text': 'After text',
        'By': 'By',
        'Before': 'Before',
        'Line Spacing': 'Line spacing',
        'After': 'After',
        'At': 'At',
        'Multiple': 'Multiple',
        'Spacing': 'Spacing',
        'Define new Multilevel list': 'Define new Multilevel list',
        'List level': 'List level',
        'Choose level to modify': 'Choose level to modify',
        'Level': 'Level',
        'Number format': 'Number format',
        'Number style for this level': 'Number style for this level',
        'Enter formatting for number': 'Enter formatting for number',
        'Start at': 'Start at',
        'Restart list after': 'Restart list after',
        'Position': 'Position',
        'Text indent at': 'Text indent at',
        'Aligned at': 'Aligned at',
        'Follow number with': 'Follow number with',
        'Tab character': 'Tab character',
        'Space': 'Space',
        'Arabic': 'Arabic',
        'UpRoman': 'UpRoman',
        'LowRoman': 'LowRoman',
        'UpLetter': 'UpLetter',
        'LowLetter': 'LowLetter',
        'Number': 'Number',
        'Leading zero': 'Leading zero',
        'Bullet': 'Bullet',
        'Ordinal': 'Ordinal',
        'Ordinal Text': 'Ordinal Text',
        'For East': 'For East',
        'No Restart': 'No Restart',
        'Font': 'Font',
        'Font style': 'Font style',
        'Underline style': 'Underline style',
        'Font color': 'Font color',
        'Effects': 'Effects',
        'Strikethrough': 'Strikethrough',
        'Superscript': 'Superscript',
        'Subscript': 'Subscript',
        'Double strikethrough': 'Double strikethrough',
        'Regular': 'Regular',
        'Bold': 'Bold',
        'Italic': 'Italic',
        'Cut': 'Cut',
        'Copy': 'Copy',
        'Paste': 'Paste',
        'Hyperlink': 'Hyperlink',
        'Open Hyperlink': 'Open Hyperlink',
        'Copy Hyperlink': 'Copy Hyperlink',
        'Remove Hyperlink': 'Remove Hyperlink',
        'Paragraph': 'Paragraph',
        'Linked Style': 'Linked(Paragraph and Character)',
        'Character': 'Character',
        'Merge Cells': 'Merge Cells',
        'Insert Above': 'Insert Above',
        'Insert Below': 'Insert Below',
        'Insert Left': 'Insert Left',
        'Insert Right': 'Insert Right',
        'Delete': 'Delete',
        'Delete Table': 'Delete Table',
        'Delete Row': 'Delete Row',
        'Delete Column': 'Delete Column',
        'File Name': 'File Name',
        'Format Type': 'Format Type',
        'Save': 'Save',
        'Navigation': 'Navigation',
        'Results': 'Results',
        'Replace': 'Replace',
        'Replace All': 'Replace All',
        'We replaced all': 'We replaced all',
        'Find': 'Find',
        'No matches': 'No matches',
        'All Done': 'All Done',
        'Result': 'Result',
        'of': 'of',
        'instances': 'instances',
        'with': 'with',
        'Click to follow link': 'Click to follow link',
        'Continue Numbering': 'Continue Numbering',
        'Bookmark name': 'Bookmark name',
        'Close': 'Close',
        'Restart At': 'Restart At',
        'Properties': 'Properties',
        'Name': 'Name',
        'Style type': 'Style type',
        'Style based on': 'Style based on',
        'Style for following paragraph': 'Style for following paragraph',
        'Formatting': 'Formatting',
        'Numbering and Bullets': 'Numbering and Bullets',
        'Numbering': 'Numbering',
        'Update Field': 'Update Field',
        'Edit Field': 'Edit Field',
        'Bookmark': 'Bookmark',
        'Page Setup': 'Page Setup',
        'No bookmarks found': 'No bookmarks found',
        'Number format tooltip information': 'Single-level number format: </br>[PREFIX]%[LEVELNUMBER][SUFFIX]</br>'
            + 'For example, "Chapter %1." will display numbering like</br>Chapter 1. Item</br>Chapter 2. Item</br>…'
            + '</br>Chapter N. Item</br>'
            + '</br>Multilevel number format:</br>[PREFIX]%[LEVELNUMBER][SUFFIX]+[PREFIX]%[LEVELNUMBER][SUFFIX]'
            + '</br>For example, "%1.%2." will display numbering like</br>1.1. Item</br>1.2. Item</br>…</br>1.N. Item',
        'Format': 'Format',
        'Create New Style': 'Create New Style',
        'Modify Style': 'Modify Style',
        'New': 'New',
        'Bullets': 'Bullets',
        'Use bookmarks': 'Use bookmarks',
        'Table of Contents': 'Table of Contents',
        'AutoFit': 'AutoFit',
        'AutoFit to Contents': 'AutoFit to Contents',
        'AutoFit to Window': 'AutoFit to Window',
        'Fixed Column Width': 'Fixed Column Width',
        'Reset': 'Reset',
        'Match case': 'Match case',
        'Whole words': 'Whole words',
        'Add': 'Add',
        'Go To': 'Go To',
        'Search for': 'Search for',
        'Replace with': 'Replace with',
        'TOC 1': 'TOC 1',
        'TOC 2': 'TOC 2',
        'TOC 3': 'TOC 3',
        'TOC 4': 'TOC 4',
        'TOC 5': 'TOC 5',
        'TOC 6': 'TOC 6',
        'TOC 7': 'TOC 7',
        'TOC 8': 'TOC 8',
        'TOC 9': 'TOC 9',
        'Right-to-left': 'Right-to-left',
        'Left-to-right': 'Left-to-right',
        'Direction': 'Direction',
        'Table direction': 'Table direction',
        'Indent from right': 'Indent from right',
        /* tslint:disable */
        "Contextual Spacing": "Don't add space between the paragraphs of the same styles",
        "Password Mismatch": "The password don't match",
        /* tslint:enable */
        'Restrict Editing': 'Restrict Editing',
        'Formatting restrictions': 'Formatting restrictions',
        'Allow formatting': 'Allow formatting',
        'Editing restrictions': 'Editing restrictions',
        'Read only': 'Read only',
        'Exceptions Optional': 'Exceptions (optional)',
        // tslint:disable-next-line:max-line-length
        'Select Part Of Document And User': 'Select parts of the document and choose users who are allowed to freely edit them.',
        'Everyone': 'Everyone',
        'More users': 'More users',
        'Add Users': 'Add Users',
        'Enforcing Protection': 'Yes, Start Enforcing Protection',
        'Start Enforcing Protection': 'Start Enforcing Protection',
        'Enter User': 'Enter User',
        'Users': 'Users',
        'Enter new password': 'Enter new password',
        'Reenter new password to confirm': 'Reenter new password to confirm',
        'Your permissions': 'Your permissions',
        // tslint:disable-next-line:max-line-length
        'Protected Document': 'This document is protected from unintentional editing.You may edit in this region.',
        'FormFieldsOnly': 'This document is protected from unintentional editing. You may only fill in forms in this region.',
        'You may format text only with certain styles': 'You may format text only with certain styles.',
        'Stop Protection': 'Stop Protection',
        'Password': 'Password',
        'Spelling Editor': 'Spelling Editor',
        'Spelling': 'Spelling',
        'Spell Check': 'Spell Check',
        'Underline errors': 'Underline errors',
        'Ignore': 'Ignore',
        'Ignore all': 'Ignore All',
        'Add to Dictionary': 'Add to Dictionary',
        'Change': 'Change',
        'Change All': 'Change All',
        'Suggestions': 'Suggestions',
        'The password is incorrect': 'The password is incorrect',
        'Error in establishing connection with web server': 'Error in establishing connection with web server',
        'Highlight the regions I can edit': 'Highlight the regions I can edit',
        'Show All Regions I Can Edit': 'Show All Regions I Can Edit',
        'Find Next Region I Can Edit': 'Find Next Region I Can Edit',
        'Keep source formatting': 'Keep source formatting',
        'Match destination formatting': 'Match destination formatting',
        'Text only': 'Text only',
        'Comments': 'Comments',
        'Type your comment': 'Type your comment',
        'Post': 'Post',
        'Reply': 'Reply',
        'New Comment': 'New Comment',
        'Edit': 'Edit',
        'Resolve': 'Resolve',
        'Reopen': 'Reopen',
        'No comments in this document': 'No comments in this document',
        'more': 'more',
        'Type your comment here': 'Type your comment here',
        'Next Comment': 'Next Comment',
        'Previous Comment': 'Previous Comment',
        'Un-posted comments': 'Un-posted comments',
        // tslint:disable-next-line:max-line-length
        'Discard Comment': 'Added comments not posted. If you continue, that comment will be discarded.',
        'No Headings': 'No Heading Found!',
        'Add Headings': 'This document has no headings. Please add headings and try again.',
        'More Options': 'More Options',
        'Click to see this comment': 'Click to see this comment',
        'Form Fields': 'Form Fields',
        'Text Form': 'Text Form',
        'Check Box': 'Check Box',
        'Drop Down Form Field': 'Drop Down Form Field',
        'Dropdown items': 'Drop-down items',
        'Items in dropdown list': 'Items in drop-down list',
        'ADD': 'ADD',
        'REMOVE': 'REMOVE',
        'Field settings': 'Field settings',
        'Tooltip': 'Tooltip',
        'Dropdown enabled': 'Drop-down enabled',
        'Check Box Form Field': 'Check Box Form Field',
        'Check box size': 'Check box size',
        'Auto': 'Auto',
        'Default value': 'Default value',
        'Not checked': 'Not checked',
        'Checked': 'Checked',
        'Check box enabled': 'Check box enabled',
        'Text Form Field': 'Text Form Field',
        'Type': 'Type',
        'Default text': 'Default text',
        'Maximum length': 'Maximum length',
        'Text format': 'Text format',
        'Fillin enabled': 'Fill-in enabled',
        'Default number': 'Default number',
        'Default date': 'Default date',
        'Date format': 'Date format',
        'Merge Track': 'This action wont be marked as change. Do you want to continue?',
        'UnTrack': 'Cannot be tracked !',
        'Accept': 'Accept',
        'Reject': 'Reject',
        'Previous Changes': 'Previous Changes',
        'Next Changes': 'Next Changes',
        'Inserted': 'Inserted',
        'Deleted': 'Deleted',
        'Move From': 'Move From',
        'Move To' : 'Move To',
        'Changes': 'Changes',
        'Accept all': 'Accept all',
        'Reject all': 'Reject all',
        'No changes': 'No changes',
        'Accept Changes': 'Accept Changes',
        'Reject Changes': 'Reject Changes',
        'User': 'User',
        'View': 'View',
        'Insertion': 'Insertion',
        'Deletion': 'Deletion',
        'All caps': 'All caps'
    };
    // Public Implementation Starts
    /**
     * Opens the given Sfdt text.
     * @param {string} sfdtText.
     */
    public open(sfdtText: string): void {
        if (!isNullOrUndefined(this.viewer)) {
            this.showComments = false;
            this.clearPreservedCollectionsInViewer();
            this.documentHelper.userCollection.push('Everyone');
            this.documentHelper.lists = [];
            this.documentHelper.abstractLists = [];
            this.documentHelper.styles = new WStyles();
            this.documentHelper.cachedPages = [];
            this.showRevisions = false;
            if (this.isSpellCheck && !this.spellChecker.enableOptimizedSpellCheck) {
                this.documentHelper.triggerElementsOnLoading = true;
                this.documentHelper.triggerSpellCheck = true;
            }
            if (!isNullOrUndefined(sfdtText) && this.viewer) {
                this.documentHelper.onDocumentChanged(this.parser.convertJsonToDocument(sfdtText));
                if (this.editorModule) {
                    this.editorModule.intializeDefaultStyles();
                }
            }
            if (this.isSpellCheck && !this.spellChecker.enableOptimizedSpellCheck) {
                this.documentHelper.triggerElementsOnLoading = false;
                this.documentHelper.triggerSpellCheck = false;
            }
        }
    }
    /**
     * Scrolls view to start of the given page number if exists.
     * @param  {number} pageNumber.
     * @returns void
     */
    public scrollToPage(pageNumber: number): boolean {
        if (isNullOrUndefined(this.viewer) || pageNumber < 1 || pageNumber > this.documentHelper.pages.length) {
            return false;
        }
        this.viewer.scrollToPage(pageNumber - 1);
        return true;
    }
    /**
     * Enables all the modules.
     * @returns void
     */
    public enableAllModules(): void {
        this.enablePrint = this.enableSfdtExport = this.enableWordExport = this.enableTextExport
            = this.enableSelection = this.enableContextMenu = this.enableSearch = this.enableOptionsPane
            = this.enableEditor = this.enableImageResizer = this.enableEditorHistory
            = this.enableHyperlinkDialog = this.enableTableDialog = this.enableBookmarkDialog
            = this.enableTableOfContentsDialog = this.enablePageSetupDialog = this.enableStyleDialog
            = this.enableListDialog = this.enableParagraphDialog = this.enableFontDialog
            = this.enableTablePropertiesDialog = this.enableBordersAndShadingDialog
            = this.enableTableOptionsDialog = this.enableSpellCheck = this.enableComment = this.enableFormField = true;
        // tslint:disable-next-line:max-line-length
        DocumentEditor.Inject(Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog, SpellChecker, SpellCheckDialog, CheckBoxFormFieldDialog, TextFormFieldDialog, DropDownFormFieldDialog);
    }
    /**
     * Resizes the component and its sub elements based on given size or container size.
     * @param width 
     * @param height 
     */
    public resize(width?: number, height?: number): void {
        if (this.element) {
            if (!isNullOrUndefined(width) && width > 200) {
                this.element.style.width = width + 'px';
            }
            if (!isNullOrUndefined(height) && height > 200) {
                this.element.style.height = height + 'px';
            }
            if (this.viewer) {
                this.documentHelper.updateViewerSize();
            }
        }
    }
    /**
     * Get all form field names. 
     */
    public getFormFieldNames(): string[] {
        let formFieldNames: string[] = [];
        let formFields: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formFields.length; i++) {
            if (formFields[i].formFieldData.name !== '') {
                formFieldNames.push(formFields[i].formFieldData.name);
            }
        }
        return formFieldNames;
    }
    /**
     * Get form field by name   
     * @param name - Form field name.
     */
    public getFormFieldInfo(name: string): TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo {
        let formFields: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formFields.length; i++) {
            if ((formFields[i].formFieldData.name === name) && (formFields[i].formFieldData.name !== '')) {
                return formFields[i].formFieldData.getFormFieldInfo();
            }
        }
        return undefined;
    }
    /**
     * Set form field.
     * @param name - Form field name.
     * @param formFieldInfo - Form Field info   
     */
    public setFormFieldInfo(name: string, formFieldInfo: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo): void {
        let formFields: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formFields.length; i++) {
            if ((formFields[i].formFieldData.name === name) && (formFields[i].formFieldData.name !== '')) {
                let currentField: FieldElementBox = formFields[i];
                if (this.selection) {
                    this.selection.selectFieldInternal(currentField);
                    if (this.editor) {
                        this.editor.setFormField(currentField, formFieldInfo);
                    }
                }
                return;
            }
        }
    }
    /**
     * Reset form field value to default.  
     * @param name - specify form field name
     */
    public resetFormFields(name?: string): void {
        let formFields: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formFields.length; i++) {
            if (isNullOrUndefined(name) || name === formFields[i].formFieldData.name) {
                if (formFields[i].formFieldData instanceof TextFormField) {
                    this.editor.updateFormField(formFields[i], (formFields[i].formFieldData as TextFormField).defaultValue, true);
                } else if (formFields[i].formFieldData instanceof CheckBoxFormField) {
                    // tslint:disable-next-line:max-line-length
                    this.editor.toggleCheckBoxFormField(formFields[i], true, (formFields[i].formFieldData as CheckBoxFormField).defaultValue);
                } else if (formFields[i].formFieldData instanceof DropDownFormField) {
                    this.editor.updateFormField(formFields[i], 0, true);
                }
            }
        }
    }
    /**
     * Import form field values.
     * @param - formDate  - { FormFieldData[] }
     */
    public importFormData(formData: FormFieldData[]): void {
        let formField: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formData.length; i++) {
            let formFieldData: FormFieldData = formData[i];
            let fieldName: string = formFieldData.fieldName;
            for (let j: number = 0; j < formField.length; j++) {
                if (formField[j].formFieldData.name === fieldName) {
                    if (formField[j].formFieldData instanceof CheckBoxFormField) {
                        this.editor.toggleCheckBoxFormField(formField[j], true, formFieldData.value as boolean);
                    } else if (formField[j].formFieldData instanceof TextFormField) {
                        this.editor.updateFormField(formField[j], formFieldData.value as string);
                    } else if (formField[j].formFieldData instanceof DropDownFormField) {
                        this.editor.updateFormField(formField[j], formFieldData.value as number);
                    }
                }
            }
        }
    }
    /**
     * Export form field values.
     * @returns - { FormFieldData[] }
     */
    public exportFormData(): FormFieldData[] {
        let data: FormFieldData[] = [];
        let formField: FieldElementBox[] = this.documentHelper.formFields;
        for (let i: number = 0; i < formField.length; i++) {
            if (formField[i].formFieldData.name !== '') {
                let formData: FormFieldData = { fieldName: '', value: '' };
                formData.fieldName = (formField[i].formFieldData as TextFormField).name;
                if (formField[i].formFieldData instanceof CheckBoxFormField) {
                    // tslint:disable-next-line:max-line-length
                    formData.value = (formField[i].formFieldData as CheckBoxFormField).checked;
                } else if (formField[i].formFieldData instanceof TextFormField) {
                    let resultText: string = '';
                    if (this.documentHelper.isInlineFormFillProtectedMode) {
                        resultText = this.editorModule.getFormFieldText(formField[i]);
                    } else {
                        resultText = formField[i].resultText;
                    }
                    let rex: RegExp = new RegExp(this.documentHelper.textHelper.getEnSpaceCharacter(), 'gi');
                    if (resultText.replace(rex, '') === '') {
                        resultText = '';
                    }
                    formData.value = resultText;
                } else if (formField[i].formFieldData instanceof DropDownFormField) {
                    // tslint:disable-next-line:max-line-length
                    formData.value = (formField[i].formFieldData as DropDownFormField).selectedIndex;
                }
                data.push(formData);
            }
        }
        return data;
    }
    /**
     * Updated fields in document.
     * Currently cross reference field only supported.
     */
    public updateFields(): void {
        for (let i: number = 0; i < this.documentHelper.fields.length; i++) {
            let field: FieldElementBox = this.documentHelper.fields[i];
            let code: string = this.selection.getFieldCode(field);
            if (code.toLowerCase().trim().indexOf('ref ') === 0) {
                this.selection.updateRefField(field);
            }
        }
    }
    /**
     * Shifts the focus to the document.
     */
    public focusIn(): void {
        if (this.viewer) {
            this.documentHelper.updateFocus();
        }
    }
    /**
     * Fits the page based on given fit type.
     * @param  {PageFitType} pageFitType? - Default value of ‘pageFitType’ parameter is 'None'
     * @returns void
     */
    public fitPage(pageFitType?: PageFitType): void {
        if (isNullOrUndefined(pageFitType)) {
            pageFitType = 'None';
        }
        if (this.viewer) {
            this.viewer.pageFitType = pageFitType;
        }
    }
    /**
     * Prints the document.
     * @param  {Window} printWindow? - Default value of 'printWindow' parameter is undefined.
     */
    public print(printWindow?: Window): void {
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation.');
        }
        if (this.printModule) {
            if (this.layoutType === 'Continuous') {
                this.documentHelper.isWebPrinting = true;
                this.viewer = new PageLayoutViewer(this);
                this.editor.layoutWholeDocument();
                this.printModule.print(this.documentHelper, printWindow);
                this.viewer = new WebLayoutViewer(this);
                this.editor.layoutWholeDocument();
                this.documentHelper.isWebPrinting = false;
            } else {
                this.printModule.print(this.documentHelper, printWindow);
            }
        } else {
            throw new Error('Invalid operation. Print is not enabled.');
        }
    }
    /**
     * Serialize the data to JSON string.
     */
    public serialize(): string {
        let json: string = '';
        if (this.enableSfdtExport && this.sfdtExportModule instanceof SfdtExport) {
            json = this.sfdtExportModule.serialize();
        } else {
            throw new Error('Invalid operation. Sfdt export is not enabled.');
        }
        return json;
    }
    /**
     * Saves the document.
     * @param {string} fileName
     * @param {FormatType} formatType
     */
    public save(fileName: string, formatType?: FormatType): void {
        fileName = fileName || 'Untitled';
        if (isNullOrUndefined(this.documentHelper)) {
            throw new Error('Invalid operation.');
        }
        if (formatType === 'Docx' && this.wordExportModule) {
            if (this.wordExportModule) {
                this.wordExportModule.save(this.documentHelper, fileName);
            }
        } else if (formatType === 'Txt' && this.textExportModule) {
            this.textExportModule.save(this.documentHelper, fileName);
        } else if (formatType === 'Sfdt' && this.enableSfdtExport && this.sfdtExportModule) {
            let jsonString: string = this.serialize();
            let blob: Blob = new Blob([jsonString], {
                type: 'application/json'
            });
            Save.save(fileName + '.sfdt', blob);
        } else {
            throw new Error('Invalid operation. Specified export is not enabled.');
        }
    }
    /**
     * Saves the document as blob.
     * @param {FormatType} formatType
     */
    public saveAsBlob(formatType?: FormatType): Promise<Blob> {
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation');
        }
        return new Promise((resolve: Function, reject: Function) => {
            if (formatType === 'Docx' && this.wordExportModule) {
                resolve(this.wordExportModule.saveAsBlob(this.documentHelper));
            } else if (formatType === 'Txt' && this.textExportModule) {
                resolve(this.textExportModule.saveAsBlob(this.documentHelper));
            } else if (formatType === 'Sfdt' && this.enableSfdtExport && this.sfdtExportModule) {
                resolve(this.sfdtExportModule.saveAsBlob(this.documentHelper));
            }
        });
    }
    /**
     * Opens a blank document.
     */
    public openBlank(): void {
        let section: BodyWidget = new BodyWidget();
        section.index = 0;
        section.sectionFormat = new WSectionFormat(section);
        if (this.sectionFormat) {
            this.parser.parseSectionFormat(this.sectionFormat, section.sectionFormat);
        }
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.index = 0;
        paragraph.paragraphFormat = new WParagraphFormat(paragraph);
        paragraph.characterFormat = new WCharacterFormat(paragraph);
        section.childWidgets.push(paragraph);
        paragraph.containerWidget = section;
        let sections: BodyWidget[] = [];
        sections.push(section);
        // tslint:disable-next-line:max-line-length
        let hfs: HeaderFooters = this.parser.parseHeaderFooter({ header: {}, footer: {}, evenHeader: {}, evenFooter: {}, firstPageHeader: {}, firstPageFooter: {} }, undefined);
        if (this.viewer) {
            this.clearPreservedCollectionsInViewer();
            this.documentHelper.userCollection.push('Everyone');
            this.documentHelper.cachedPages = [];
            this.documentHelper.setDefaultDocumentFormat();
            this.documentHelper.headersFooters.push(hfs);
            this.documentHelper.onDocumentChanged(sections);
            if (this.editorModule) {
                this.editorModule.intializeDefaultStyles();
                let style: WStyle = this.documentHelper.styles.findByName('Normal') as WStyle;
                paragraph.paragraphFormat.baseStyle = style;
                paragraph.paragraphFormat.listFormat.baseStyle = style;
            }
        }
    }
    /**
     * Gets the style names based on given style type.
     * @param styleType 
     */
    public getStyleNames(styleType?: StyleType): string[] {
        if (this.viewer) {
            return this.documentHelper.styles.getStyleNames(styleType);
        }
        return [];
    }
    /**
     * Gets the style objects on given style type.
     * @param styleType 
     */
    public getStyles(styleType?: StyleType): Object[] {
        if (this.viewer) {
            return this.documentHelper.styles.getStyles(styleType);
        }
        return [];
    }
    /**
     * Gets the bookmarks.
     */
    public getBookmarks(): string[] {
        let bookmarks: string[] = [];
        if (this.viewer) {
            bookmarks = this.documentHelper.getBookmarks(true);
        }
        return bookmarks;
    }
    /**
     * Shows the dialog.
     * @param {DialogType} dialogType
     * @returns void
     */
    public showDialog(dialogType: DialogType): void {
        switch (dialogType) {
            case 'Hyperlink':
                this.showHyperlinkDialog();
                break;
            case 'Table':
                this.showTableDialog();
                break;
            case 'Bookmark':
                this.showBookmarkDialog();
                break;
            case 'TableOfContents':
                this.showTableOfContentsDialog();
                break;
            case 'PageSetup':
                this.showPageSetupDialog();
                break;
            case 'List':
                this.showListDialog();
                break;
            case 'Styles':
                this.showStylesDialog();
                break;
            case 'Style':
                this.showStyleDialog();
                break;
            case 'Paragraph':
                this.showParagraphDialog();
                break;
            case 'Font':
                this.showFontDialog();
                break;
            case 'TableProperties':
                this.showTablePropertiesDialog();
                break;
            case 'BordersAndShading':
                this.showBordersAndShadingDialog();
                break;
            case 'TableOptions':
                this.showTableOptionsDialog();
                break;
            case 'SpellCheck':
                this.showSpellCheckDialog();
                break;
        }
    }
    /**
     * Shows the options pane.
     */
    public showOptionsPane(): void {
        if (!isNullOrUndefined(this.optionsPaneModule) && !isNullOrUndefined(this.viewer)) {
            this.optionsPaneModule.showHideOptionsPane(true);
        }
    }
    /**
     * Shows the restrict editing pane.
     */
    public showRestrictEditingPane(): void {
        if (this.documentHelper && this.documentHelper.restrictEditingPane) {
            this.documentHelper.restrictEditingPane.showHideRestrictPane(true);
        }
    }
    /**
     * Shows the spell check dialog.
     * @private
     */
    public showSpellCheckDialog(): void {
        if (this.spellCheckDialogModule && this.spellChecker) {
            let element: ContextElementInfo = this.spellChecker.retriveText();
            this.spellCheckDialogModule.show(element.text, element.element);
        }
    }
    /**
     * Destroys all managed resources used by this object. 
     */
    public destroy(): void {
        super.destroy();
        this.destroyDependentModules();
        if (!isNullOrUndefined(this.documentHelper)) {
            this.documentHelper.destroy();
        }
        this.viewer = undefined;
        if (!isNullOrUndefined(this.element)) {
            this.element.classList.remove('e-documenteditor');
            this.element.innerHTML = '';
        }
        this.element = undefined;
        this.findResultsList = [];
        this.findResultsList = undefined;
    }
    /* tslint:disable */
    private destroyDependentModules(): void {
        if (this.printModule) {
            this.printModule.destroy();
            this.printModule = undefined;
        }
        if (this.sfdtExportModule) {
            this.sfdtExportModule.destroy();
            this.sfdtExportModule = undefined;
        }
        if (this.optionsPaneModule) {
            this.optionsPaneModule.destroy();
            this.optionsPaneModule = undefined;
        }
        if (this.commentReviewPane) {
            this.commentReviewPane.destroy();
            this.commentReviewPane = undefined;
        }
        if (this.trackChangesPane) {
            this.trackChangesPane.destroy();
            this.trackChangesPane = undefined;
        }
        if (!isNullOrUndefined(this.hyperlinkDialogModule)) {
            this.hyperlinkDialogModule.destroy();
            this.hyperlinkDialogModule = undefined;
        }
        if (this.searchModule) {
            this.searchModule.destroy();
            this.searchModule = undefined;
        }
        if (this.contextMenuModule) {
            this.contextMenuModule.destroy();
            this.contextMenuModule = undefined;
        }
        if (this.editorModule) {
            this.editorModule.destroy();
            this.editorModule = undefined;
        }
        if (this.selectionModule) {
            this.selectionModule.destroy();
            this.selectionModule = undefined;
        }
        if (this.editorHistoryModule) {
            this.editorHistoryModule.destroy();
            this.editorHistoryModule = undefined;
        }
        if (!isNullOrUndefined(this.paragraphDialogModule)) {
            this.paragraphDialogModule.destroy();
            this.paragraphDialogModule = undefined;
        }
        if (this.pageSetupDialogModule) {
            this.pageSetupDialogModule.destroy();
            this.pageSetupDialogModule = undefined;
        }
        if (this.fontDialogModule) {
            this.fontDialogModule.destroy();
            this.fontDialogModule = undefined;
        }
        if (this.listDialogModule) {
            this.listDialogModule.destroy();
            this.listDialogModule = undefined;
        }
        if (this.imageResizerModule) {
            this.imageResizerModule.destroy();
            this.imageResizerModule = undefined;
        }
        if (this.tablePropertiesDialogModule) {
            this.tablePropertiesDialogModule.destroy();
            this.tablePropertiesDialogModule = undefined;
        }
        if (this.bordersAndShadingDialogModule) {
            this.bordersAndShadingDialogModule.destroy();
            this.bordersAndShadingDialogModule = undefined;
        }
        if (this.cellOptionsDialogModule) {
            this.cellOptionsDialogModule.destroy();
            this.cellOptionsDialogModule = undefined;
        }
        if (this.tableOptionsDialogModule) {
            this.tableOptionsDialogModule.destroy();
            this.tableOptionsDialogModule = undefined;
        }
        if (this.tableDialogModule) {
            this.tableDialogModule.destroy();
            this.tableDialogModule = undefined;
        }
        if (this.styleDialogModule) {
            this.styleDialogModule = undefined;
        }
        if (this.bookmarkDialogModule) {
            this.bookmarkDialogModule.destroy();
            this.bookmarkDialogModule = undefined;
        }
        if (this.styleDialogModule) {
            this.styleDialogModule.destroy();
            this.styleDialogModule = undefined;
        }
        if (this.textExportModule) {
            this.textExportModule.destroy();
            this.textExportModule = undefined;
        }
        if (this.wordExportModule) {
            this.wordExportModule.destroy();
            this.wordExportModule = undefined;
        }
        if (this.tableOfContentsDialogModule) {
            this.tableOfContentsDialogModule.destroy();
            this.tableOfContentsDialogModule = undefined;
        }
        if (this.spellCheckerModule) {
            this.spellCheckerModule.destroy();
            this.spellCheckerModule = undefined;
        }
    }
    /* tslint:enable */
    // Public Implementation Ends.
}

/**
 * The `ServerActionSettings` module is used to provide the server action methods of Document Editor.
 */
export class ServerActionSettings extends ChildProperty<ServerActionSettings> {

    /**
     * Specifies the system clipboard action of Document Editor.
     * @default 'SystemClipboard'
     */
    @Property('SystemClipboard')
    public systemClipboard: string;

    /**
     * Specifies the spell check action of Document Editor.
     * @default 'SpellCheck'
     */
    @Property('SpellCheck')
    public spellCheck: string;

    /**
     * Specifies the restrict editing encryption/decryption action of Document Editor.
     * @default 'RestrictEditing'
     */
    @Property('RestrictEditing')
    public restrictEditing: string;
}

/**
 * Form field settings.
 */
export class FormFieldSettings extends ChildProperty<FormFieldSettings> {

    /**
     * Get or Set form fields shading color.
     * You can customize shading color in application level, but cannot be exported in file level
     * @default '#cfcfcf'
     */
    @Property('#cfcfcf')
    public shadingColor: string;

    /**
     * Get or Set whether apply shadings for field or not. 
     * @default true
     */
    @Property(true)
    public applyShading: boolean;

    /**
     * Get or Set field selection color. 
     * @default '#cccccc'
     */
    @Property('#cccccc')
    public selectionColor: string;
    /**
     * Get or Set form filling mode type. 
     * @default 'Popup'
     */
    @Property('Popup')
    public formFillingMode: FormFillingMode;
    /**
     * Get or Set formatting exception. 
     * @default []
     */
    @Property([])
    public formattingExceptions: FormattingExceptions[];
}



/**
 * The `ServerActionSettings` module is used to provide the server action methods of Document Editor Container.
 */
export class ContainerServerActionSettings extends ServerActionSettings {
    /**
     * Specifies the load action of Document Editor.
     * @default 'Import'
     */
    @Property('Import')
    public import: string;
}




