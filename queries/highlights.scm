; Structs
;------------

(enum_variant) @type.variant
(struct_entry (_) @keyword ":")
(struct_name (identifier)) @type


; Literals
;------------

(string) @string
(boolean) @constant.boolean
(integer) @constant.numeric
(float) @constant.numeric
(char) @constant.character


; Comments
;------------

(line_comment) @comment.line
(block_comment) @comment.block


; Punctuation
;------------

"," @punctuation.delimiter
":" @punctuation.delimiter

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket


; Special
;------------

(escape_sequence) @constant.character.escape
(ERROR) @error
