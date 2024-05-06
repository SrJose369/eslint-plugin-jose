# Hola
## uWu package

### Mi primer package. Es un plugin para ESLint, con custom rules que cree de acuerdo a mis gustos
- ## Usar explicitamente false o true cuando se pregunta por booleanos en un if.
- ## No usar ! para negar un booleanos.
- ## En una Expresion Binaria el lado izquierdo no puede ser un Literal(false o true).

> ## [0.2.3] - 2024-05-06
### <t>Added</t>
- Nueva regla, no usar arrow functions y usar funciones nombrabas y evitar problemas con funciones anonimas, sobre todo para debuggear(me paso en mi extension).

> ## [0.2.2] - 2023-04-17
### <t>Fixed</t>
- Si el Expresion es un MemberExpression no andaba, para una funcion y una varibale, osea accederlo desde un objeto, ahora ya anda.

> ## [0.2.1] - 2023-04-03
### <t>Fixed</t>
- Pequeño fix, si el UnaryExpresion era otra cosa que no sea "!", tambien me daba error, como "typeof", ahora solo da error si el operator es "!".
- Ahora si se usa un Litera en BinaryExpresion solo da error si el value del Literal es boolean.

> ## [0.2.0] - 2023-03-30
### <t>Changed</t>
Por ahora todo esta andando bien, cambie algunas cosas, deje todo mas ordenando para poder suibrlo a github.

## Contributing
### Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### Please make sure to update tests as appropriate.

## Since: **V0.1.0** 2023-03-29 16_25_49

## License [MIT](https://choosealicense.com/licenses/mit/)

[0.2.3]: https://github.com/SrJose369/eslint-plugin-jose/releases/tag/v0.2.3
[0.2.2]: https://github.com/SrJose369/eslint-plugin-jose/releases/tag/v0.2.2
[0.2.1]: https://github.com/SrJose369/eslint-plugin-jose/releases/tag/v0.2.1
[0.2.0]: https://github.com/SrJose369/eslint-plugin-jose/releases/tag/v0.2.0