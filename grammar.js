// Reference: https://github.com/ron-rs/ron/blob/master/docs/grammar.md

module.exports = grammar({
  name: 'ron',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  externals: $ => [
    $._string_content,
    $.raw_string,
    $.float,
    $.block_comment,
  ],

  rules: {
    source_file: $ => seq(
      $._value,
    ),

    _value: $ => choice(
      // compund types
      $.array,
      $.map,
      $.struct,
      $.tuple,
      // literals
      $.string,
      $.char,
      $.boolean,
      $.integer,
      $.float,
      $.negative,
      // enum variant
      $.enum_variant,
    ),

    enum_variant: $ => $.identifier,

    array: $ => seq(
      '[',
      sepBy(',', $._value),
      optional(','),
      ']',
    ),

    map: $ => seq(
      '{',
      sepBy(',', $.map_entry),
      optional(','),
      '}',
    ),

    struct: $ => choice(
      $._unit_struct,
      $._tuple_struct,
      $._named_struct
    ),

    _unit_struct: $ => choice(
      // $.identifier,
      '()'
    ),

    struct_name: $ => $.identifier,

    _tuple_struct: $ => seq(
      $.struct_name,
      $.tuple,
    ),

    _named_struct: $ => seq(
      optional($.struct_name),
      '(',
      sepBy(',', $.struct_entry),
      optional(','),
      ')',
    ),

    tuple: $ => seq(
      '(',
      sepBy1(',', $._value),
      optional(','),
      ')',
    ),

    map_entry: $ => seq(
      $._value,
      ':',
      $._value,
    ),

    struct_entry: $ => seq(
      $.identifier,
      ':',
      $._value,
    ),

    identifier: $ => /(r#)?[_\p{XID_Start}][_\p{XID_Continue}]*/,

    negative: $ => seq('-', choice($.integer, $.float)),

    integer: $ => token(seq(
      choice(
        /[0-9][0-9_]*/,
        /0x[0-9a-fA-F_]+/,
        /0b[01_]+/,
        /0o[0-7_]+/
      ),
    )),

    string: $ => seq(
      alias(/b?"/, '"'),
      repeat(choice(
        $.escape_sequence,
        $._string_content
      )),
      token.immediate('"')
    ),

    char: $ => token(seq(
      optional('b'),
      '\'',
      optional(choice(
        seq('\\', choice(
          /[^xu]/,
          /u[0-9a-fA-F]{4}/,
          /u{[0-9a-fA-F]+}/,
          /x[0-9a-fA-F]{2}/
        )),
        /[^\\']/
      )),
      '\''
    )),

    escape_sequence: $ => token.immediate(
      seq('\\',
        choice(
          /[^xu]/,
          /u[0-9a-fA-F]{4}/,
          /u{[0-9a-fA-F]+}/,
          /x[0-9a-fA-F]{2}/
        )
      )),

    boolean: $ => choice('true', 'false'),

    comment: $ => choice(
      $.line_comment,
      $.block_comment
    ),

    line_comment: $ => token(seq(
      '//', /.*/
    )),
  }
});

function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)))
}

function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule))
}
