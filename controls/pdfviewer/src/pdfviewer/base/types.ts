/**
 * Enum toolbarItem for toolbar settings
 */
export type ToolbarItem =
    'OpenOption' |
    'PageNavigationTool' |
    'MagnificationTool' |
    'PanTool' |
    'SelectionTool' |
    'SearchOption' |
    'PrintOption' |
    'DownloadOption' |
    'UndoRedoTool' |
    'AnnotationEditTool' |
    'CommentTool';

/**
 * Enum AnnotationToolbarItem for annotation toolbar settings
 */
export type AnnotationToolbarItem =
    'HighlightTool' |
    'UnderlineTool' |
    'StrikethroughTool' |
    'ShapeTool' |
    'CalibrateTool' |
    'ColorEditTool' |
    'StrokeColorEditTool' |
    'ThicknessEditTool' |
    'OpacityEditTool' |
    'AnnotationDeleteTool' |
    'StampAnnotationTool' |
    'HandWrittenSignatureTool' |
    'FreeTextAnnotationTool' |
    'FontFamilyAnnotationTool' |
    'FontSizeAnnotationTool' |
    'FontStylesAnnotationTool' |
    'FontAlignAnnotationTool' |
    'FontColorAnnotationTool'|
    'CommentPanelTool';
/**
 * Enum LinkTarget for hyperlink navigation
 */
export type LinkTarget = 'CurrentTab' | 'NewTab' | 'NewWindow';
/**
 * Enum InteractionMode for interaction mode
 */
export type InteractionMode = 'TextSelection' | 'Pan';

/**
 * Enum AnnotationType for specifying Annotations
 */
// tslint:disable-next-line:max-line-length
export type AnnotationType = 'None' | 'Highlight' | 'Underline' | 'Strikethrough' | 'Line' | 'Arrow' | 'Rectangle' | 'Circle' | 'Polygon' | 'Distance' | 'Perimeter' | 'Area' | 'Radius' | 'Volume' | 'FreeText' | 'HandWrittenSignature' | 'Stamp' | 'Image' | 'StickyNotes';

/**
 * Enum LineHeadStyle for line and arrow annotation
 */
export type LineHeadStyle = 'None' | 'Closed' | 'Open' | 'Square' | 'Round' | 'Diamond';

/**
 * Enum unit for calibration annotation
 */
export type CalibrationUnit = 'pt' | 'in' | 'mm' | 'cm' | 'p' | 'ft'| 'ft_in' | 'm';

/**
 * Enum unit for ContextMenu Actions
 */
export type ContextMenuAction = 'None' | 'MouseUp' | 'RightClick';

/**
 * Enum for font styles
 */
export enum FontStyle {
    None = 0,
    Bold = 1,
    Italic = 2,
    Underline = 4,
    Strikethrough = 8,
}

/**
 * enum for context menu items
 */
export enum ContextMenuItem {
    Copy = 0,
    Highlight = 1,
    Cut = 2,
    Underline = 4,
    Paste = 8,
    Delete = 16,
    ScaleRatio = 32,
    Strikethrough = 64,
    Properties = 128,
    Comment = 256,
}


/**
 * Enum unit for text alignment
 */
export type TextAlignment = 'Left' | 'Right' | 'Center' | 'Justify';

/**
 * Enum for annotation selector shapes
 */
export type AnnotationResizerShape = 'Square' | 'Circle';

/**
 * Enum for annotation resizer location
 */
export enum AnnotationResizerLocation {
    Corners = 1,
    Edges = 2
}

/**
 * set the ZoomMode on rendering
 */
export type ZoomMode = 'Default' | 'FitToWidth' | 'FitToPage';

/**
 * Enum for Print Mode
 */
export type PrintMode = 'Default' | 'NewWindow' ;

/**
 * Enum for cursor type
 */
export enum CursorType {
    auto = 'auto',
    crossHair = 'crosshair',
    e_resize = 'e-resize',
    ew_resize = 'ew-resize',
    grab = 'grab',
    grabbing = 'grabbing',
    move = 'move',
    n_resize = 'n-resize',
    ne_resize = 'ne-resize',
    ns_resize = 'ns-resize',
    nw_resize = 'nw-resize',
    pointer = 'pointer',
    s_resize = 's-resize',
    se_resize = 'se-resize',
    sw_resize = 'sw-resize',
    text = 'text',
    w_resize = 'w-resize'
}
