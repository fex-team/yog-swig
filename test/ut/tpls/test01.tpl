{%html "ns:static/mod.js"%}
    {%head%}
        {%require "ns:static/test.js"%}
        {%script%}
            function t() {
                console.log('test');
            }
        {%endscript%}
    {%endhead%}
    {%body%}
        {%widget "ns:widget/widget01.tpl" id="widget01" mode="pipe" group="a" with obj_var%}
    {%endbody%}
{%endhtml%}