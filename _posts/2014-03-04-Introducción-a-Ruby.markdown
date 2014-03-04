---
layout: post
title:  "Introducción a Ruby"
date:   2014-03-04 01:10:36
categories: ruby programacion
---

Primer post de introducción a Ruby y que me servirá para practicar el posteo en formato 'yaml' en este blog. Esta introducción no es más que un resumen del curso de iniciación a ruby disponible en la web [CursoIniciacionRuby].

Conceptos básicos
-----------------
  * Lenguaje interpretado, no compilado.
  * Orientado a objetos, todo es un objeto. 

Ejemplo que escribe los números del 1 al 10:

{% highlight ruby %}
10.times{|i| puts i + 1}
{% endhighlight %}


  * Case sensitive, diferenciamos entres minúsculas/mayúsculas. 

En este ejemplo vemos 2 variables con el mismo nombre pero diferenciadas por la primera letra.

{% highlight ruby %}
mcfly = 'Marty McFly'
{% endhighlight %}

{% highlight ruby %}
Mcfly = 'Marty McFly'
{% endhighlight %}


  * No hace falta RETURN, siempre devuelve el resultado de la última expresión interpretada.

En este ejemplo, definimos una función de suma y aunque no definimos el return de la función, cuando invoquemos la misma nos devolverá la suma.
{% highlight ruby %}
def suma(a,b)
  a + b
end
{% endhighlight %}


  * Convenciones
    - Clases : CamelCase. Primer letra de cada palabra en mayúsculas.
    - Métodos : snake_case. Todo en minúscula y separamos las palabras con un '_'.
    - Variables : snake_case. Idem.
    - Constantes : mayúsculas. Todo en mayúsculas.

[CursoIniciacionRuby]:    http://www.floqq.com/
