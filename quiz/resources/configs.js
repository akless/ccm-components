/**
 * @overview configurations of ccm component for rendering a quiz
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "demo": {
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/quiz/resources/weblysleek.css", { "context": "head", "url": "https://akless.github.io/ccm-components/libs/weblysleekui/font.css" } ],
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-1.0.0.min.js" ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ],
    "questions": [
      {
        "text": "How many of these answers are correct?",
        "description": "Select the correct answer from the following answers.",
        "answers": [
          {
            "text": "one",
            "comment": "Because you can't choose more than one answer."
          },
          "two",
          "three"
        ],
        "input": "radio",
        "correct": 0
      },
      {
        "text": "How many answers can be correct here?",
        "description": "Pay attention to the input field type.",
        "answers": [
          "absolutely none",
          {
            "text": "maximum of one",
            "comment": "Because you can choose more than one answer."
          },
          "more than one"
        ],
        "correct": [ true, false, true ]
      },
      {
        "text": "What is the solution to the following arithmetical tasks?",
        "description": "Please enter the solutions into the input fields.",
        "answers": [
          "=&nbsp; 1 + 1",
          "=&nbsp; 1 - 1",
          "=&nbsp;-1 - 1"
        ],
        "input": "number",
        "attributes": {
          "min": -2,
          "max": 2
        },
        "correct": [ 2, 0, -2 ]
      }
    ],
    "feedback": true,
    "navigation": true,
    "placeholder.finish": "Restart",
    "onfinish": { "restart": true }
  },
  "local": {
    "css": [ "ccm.load", "resources/weblysleek.css", { "context": "head", "url": "../libs/weblysleekui/font.css" } ],
    "user": [ "ccm.instance", "../user/ccm.user.js" ],
    "logger": [ "ccm.instance", "../log/ccm.log.js", [ "ccm.get", "../log/resources/configs.js", "greedy" ] ],
    "questions": [
      {
        "text": "How many of these answers are correct?",
        "description": "Select the correct answer from the following answers.",
        "answers": [
          {
            "text": "one",
            "comment": "Because you can't choose more than one answer."
          },
          "two",
          "three"
        ],
        "input": "radio",
        "correct": 0
      },
      {
        "text": "How many answers can be correct here?",
        "description": "Pay attention to the input field type.",
        "answers": [
          "absolutely none",
          {
            "text": "maximum of one",
            "comment": "Because you can choose more than one answer."
          },
          "more than one"
        ],
        "correct": [ true, false, true ]
      },
      {
        "text": "What is the solution to the following arithmetical tasks?",
        "description": "Please enter the solutions into the input fields.",
        "answers": [
          "=&nbsp; 1 + 1",
          "=&nbsp; 1 - 1",
          "=&nbsp;-1 - 1"
        ],
        "input": "number",
        "attributes": {
          "min": -2,
          "max": 2
        },
        "correct": [ 2, 0, -2 ]
      }
    ],
    "feedback": true,
    "navigation": true,
    "placeholder.finish": "Restart",
    "onfinish": { "restart": true }
  },
  "se_ws17_testabdeckung": {
    "quiz_key": "quiz_testabdeckung",
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.1.min.js", [ "ccm.get", "https://kaul.inf.h-brs.de/data/2017/se1/json/log_configs.js", "se_ws17_quiz" ] ],
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/quiz/resources/weblysleek.css", {
      "context": "head",
      "url": "https://akless.github.io/ccm-components/libs/weblysleekui/font.css"
    } ],
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.1.min.js", {
      "sign_on": "hbrsinfkaul",
      "logged_in": true
    } ],
    "feedback": true,
    "navigation": true,
    "skippable": true,
    "anytime_finish": true,
    "start_button": true,
    "onfinish": { "restart": true },
    "placeholder.finish": "Close",
    "placeholder.correct": "Korrekte Lösung: ",
    "questions": [
      {
        "text": "Welche Testverfahren gibt es?",
        "answers": [
          {
            "text": "statische Datenflusstests",
            "comment": "Es gibt zwar statische Datenflussanalysen, aber keine statischen Datenflusstests."
          },
          {
            "text": "dynamische Verifikation",
            "comment": "Tests sind dynamisch. Verifikation ist statisch."
          },
          {
            "text": "dynamische Kontrollflusstestverfahren",
            "comment": "Tests sind dynamisch. Kontrollfluss ist eines der Testabdeckungsmaße."
          },
          {
            "text": "White Box-Verfahren Anweisungsüberdeckung",
            "comment": "Zur Messung der Anweisungsüberdeckung benötigt man den Einblick in den Quellcode. Also White Box."
          }
        ],
        "correct": [ false, false, true, true ]
      },
      {
        "text": "Welche Art von Testverfahren werden in der Praxis bei Unit-Tests hauptsächlich eingesetzt?",
        "answers": [
          {
            "text": "formale Verfahren",
            "comment": "Formale Verfahren wie Verifikation benötigen selbst keine Unit-Tests."
          },
          {
            "text": "Verifikation",
            "comment": "Verifikation zielt auf einen mathematischen Beweis der Korrektheit und nicht auf die Erfüllung von Unit-Tests."
          },
          {
            "text": "statische Analysen",
            "comment": "Statische Analysen werden aufgrund der statischen Quellcode-Struktur durchgeführt, nicht durch Unit-Tests."
          },
          {
            "text": "dynamische Testverfahren",
            "comment": "Ja. Mit Unit-Tests kann man verschiedene dynamische Testverfahren durchführen."
          }
        ],
        "correct": [ false, false, false, true ]
      },
      {
        "text": "Welches ist das effektivste Testverfahren? (gemessen in Anzahl der gefundenen Defekte pro investierter Arbeitsstunde)",
        "answers": [
          {
            "text": "Code lesen / Code inspizieren",
            "comment": "Gefundene Defekte pro Stunde: 1,057"
          },
          {
            "text": "White Box",
            "comment": "Gefundene Defekte pro Stunde: 0,322"
          },
          {
            "text": "Black Box",
            "comment": "Gefundene Defekte pro Stunde: 0,282"
          },
          {
            "text": "Normale Nutzung",
            "comment": "Gefundene Defekte pro Stunde: 0,210"
          }
        ],
        "input": "radio",
        "correct": 0
      },
      {
        "text": "Wie ist Testabdeckung (<i>code coverage</i>) definiert?",
        "answers": [
          {
            "text": "Testabdeckung ist eine Metrik zur Qualitätssicherung von Software",
            "comment": "Das ist keine Definition. Außerdem ist Testabdeckung eine Metrik zur Qualitätssicherung von Tests, nicht von Software allgemein."
          },
          {
            "text": "Die Anzahl getesteter Fälle dividiert durch die Anzahl aller möglichen Fälle",
            "comment": "Richtig, das ist die allgemeinste Definition von Testabdeckung (<i>code coverage</i>). Wobei die Anzahl aller möglichen Fälle unterschiedlich definiert sein kann."
          },
          {
            "text": "Testabdeckung ist das Maß der Abdeckung von Testfunktionen.",
            "comment": "Das ist keine Definition. Außerdem werden nicht die Testfunktionen abgedeckt, sondern die zu testende Software durch Tests."
          }
        ],
        "input": "radio",
        "correct": 1
      },
      {
        "text": "Wie ist Metrik definiert?",
        "answers": [
          {
            "text": "Eine Metrik definiert ein metrisches Maß (also in Meter statt in Inches).",
            "comment": "Es gibt verschiedene Maßeinheiten (Meter und Inches). Die Meter-Maßeinheit nennt man auch metrisch. Aber Metrik ist etwas anderes."
          },
          {
            "text": "Eine Metrik ist eine asymmetrische Funktion, die je zwei Elemente vergleicht und einen Wert zwischen -1 und +1 zuordnet.",
            "comment": "Das wäre bestenfalls eine Comparator-Funktion."
          },
          {
            "text": "Eine Metrik ist eine symmetrische Funktion, die je zwei Punkte eines Datenraums einen nicht negativen reellen Wert zuordnet, der immer kleiner oder gleich ist der Summe der Abstände zu einem dritten Punkt.",
            "comment": "Metrik heißt auch Abstandsfunktion, die den Abstand zweier Punkte misst. Es gelten 3 Axiome: (1.) Positive Definitheit, (2.) Symmetrie, (3.) Dreiechsungleichung: Ein Umweg über einen dritten Punkt kann nie kürzer sein als der direkte Weg."
          },
          {
            "text": "Eine Metrik ist eine Funktion, die je zwei Elemente in Beziehung setzt und den Prozentanteil des ersten Elements im Verhältnis zum zweiten Element als Wert zuordnet.",
            "comment": "Das wäre nur simple Prozentrechnung, aber keine Metrik."
          }
        ],
        "input": "radio",
        "correct": 2
      },
      {
        "text": "Wie viele Pfade müssen beim Pfadüberdeckungstestverfahren in folgendem Code-Beispiel durchlaufen werden? <br><pre style=\"background-color:#ffffff;color:#000000;font-family:'Menlo';\"><meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"><span style=\"color:#808080;font-style:italic;\">// Eingabe: a:int, b:int, c:int<br></span><span style=\"color:#808080;font-style:italic;\">// Ergebnis: |a| + |b| + |c|<br></span><span style=\"color:#000080;font-weight:bold;\">int </span>manhattan(<span style=\"color:#000080;font-weight:bold;\">int </span>a, <span style=\"color:#000080;font-weight:bold;\">int </span>b, <span style=\"color:#000080;font-weight:bold;\">int </span>c) {<br> <span style=\"color:#000080;font-weight:bold;\">if </span>(a &lt; <span style=\"color:#0000ff;\">0</span>)<br> a = -a;<br> <span style=\"color:#000080;font-weight:bold;\">if </span>(b &lt; <span style=\"color:#0000ff;\">0</span>)<br> b = -b;<br> <span style=\"color:#000080;font-weight:bold;\">if </span>(c &lt; <span style=\"color:#0000ff;\">0</span>)<br> c = -c;<br> <span style=\"color:#000080;font-weight:bold;\">return </span>a+b+c;<br>}</pre>",
        "answers": [
          {
            "text": "Antwort:",
            "comment": "Weil 3-mal binäre Verzweigung: 2 * 2 * 2 = 8"
          }
        ],
        "input": "number",
        "attributes": { "min": 0 },
        "swap": true,
        "correct": 8
      },
      {
        "text": "Wie viele Testdaten benötigt man minimal für den <i>Boundary Interior</i>-Test in folgendem Code-Beispiel? <br><pre style=\"background-color:#ffffff;color:#000000;font-family:'Menlo';\"><meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"><meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"><span style=\"color:#000080;font-weight:bold;\">int </span>foobar( <span style=\"color:#000080;font-weight:bold;\">int</span>[] a, <span style=\"color:#000080;font-weight:bold;\">int </span>i ){<br> <span style=\"color:#000080;font-weight:bold;\">while </span>( i &lt; a.<span style=\"color:#660e7a;font-weight:bold;\">length </span>&amp;&amp; a[i] &gt; <span style=\"color:#0000ff;\">0 </span>) {<br> <span style=\"color:#000080;font-weight:bold;\">if </span>( a[i] &lt; <span style=\"color:#0000ff;\">100 </span>)<br> foo( a[i] );<br> <span style=\"color:#000080;font-weight:bold;\">else<br></span><span style=\"color:#000080;font-weight:bold;\"> </span>bar(<span style=\"color:#0000ff;\">100 </span>* i / a[i]);<br> i++;<br> }<br> <span style=\"color:#000080;font-weight:bold;\">return </span>i;<br>}</pre>\n",
        "answers": [
          {
            "text": "Antwort:",
            "comment": "3 Fälle: exterior (Schleife nicht betreten), boundary (Schleife betreten, aber nicht wiederholen), interior (Schleife wiederholen)"
          }
        ],
        "input": "number",
        "attributes": { "min": 0 },
        "swap": true,
        "correct": 3
      },
      {
        "text": "Welches Testüberdeckungskriterium ist schärfer (d.h. verlangt mehr Tests)? (vgl. Subsumptionsheterarchie)",
        "answers": [
          {
            "text": "C0 ist schärfer als C1",
            "comment": "Umgekehrt: C1 ist schärfer als C0. Bei C0 muss jede Anweisung, bei C1 jeder Zweig getestet sein. Das kann sehr viel mehr Testdaten erfordern."
          },
          {
            "text": "Bedingungs-/Entscheidungsüberdeckung ist schärfer als Zweigüberdeckung (C1)",
            "comment": "weil die Zweigüberdeckung ein Teil davon ist"
          },
          {
            "text": "Minimaler Mehrfach-Bedingungsüberdeckung ist schärfer als Mehrfach- Bedingungsüberdeckung",
            "comment": "Umgekehrt: Mehrfach-Bedingungsüberdeckung ist schärfer als die Minimale Mehrfach-Bedingungsüberdeckung"
          },
          {
            "text": "Minimaler Mehrfach-Bedingungsüberdeckung ist schärfer als Bedingungs-/Entscheidungsüberdeckung",
            "comment": "Richtig, weil bei der Mehrfach-Bedingungsüberdeckung auch Kombinationen der Bedingungen geprüft werden."
          },
          {
            "text": "Modifizierter Boundary Interior-Test ist schärfer als Pfadüberdeckung",
            "comment": "Umgekehrt: Pfadüberdeckung ist das Maximum, das man fordern kann."
          },
          {
            "text": "Pfadüberdeckung ist schärfer als Zweigüberdeckung (C1)",
            "comment": "Richtig: Pfadüberdeckung ist das Maximum, das man fordern kann."
          },
          {
            "text": "Strukturierter Pfadtest ist schärfer als Modifizierter Boundary Interior-Test",
            "comment": "Kann man so nicht sagen. Beide Kriterien liegen quer zu einander."
          },
          {
            "text": "Strukturierter Pfadtest ist schärfer als Boundary Interior-Test",
            "comment": "Richtig."
          },
          {
            "text": "Strukturierter Pfadtest ist schärfer als Mehrfach- Bedingungsüberdeckung",
            "comment": "Kann man so nicht sagen. Beide Kriterien liegen quer zu einander."
          },
          {
            "text": "Mehrfach- Bedingungsüberdeckung ist schärfer als Anweisungsüberdeckung (C0)",
            "comment": "Anweisungsüberdeckung ist das schwächste Kriterium"
          }
        ],
        "correct": [ false, true, false, true, false, true, false, true, false, true ]
      },
      {
        "text": "Mit wie vielen Testdaten kann man bei folgendem Code-Beispiel C1 erreichen? Was ist das Minimum?<br><pre style=\"background-color:#ffffff;color:#000000;font-family:'Menlo';\"><meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"><meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"><meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"><span style=\"color:#000080;font-weight:bold;\">void </span>minimum(<span style=\"color:#000080;font-weight:bold;\">int </span>i){<br> <span style=\"color:#000080;font-weight:bold;\">while </span>(i &gt; <span style=\"color:#0000ff;\">0</span>){<br> <span style=\"color:#000080;font-weight:bold;\">if </span>(i&gt;<span style=\"color:#0000ff;\">100</span>) i -= <span style=\"color:#0000ff;\">100</span>;<br> <span style=\"color:#000080;font-weight:bold;\">if </span>(i&gt;<span style=\"color:#0000ff;\">10</span>) i -= <span style=\"color:#0000ff;\">10</span>;<br> System.<span style=\"color:#660e7a;font-weight:bold;font-style:italic;\">out</span>.println(i);<br> i--;<br> }<br>}</pre>",
        "answers": [
          {
            "text": "Antwort:",
            "comment": "z.B. mit 0 und 101. Wegen i-- würden alle Zweige ebenfalls durchlaufen. "
          }
        ],
        "input": "number",
        "attributes": { "min": 0 },
        "swap": true,
        "correct": 2
      },
      {
        "text": "Welches Testüberdeckungskriterium erfüllt die Tests mit 1,2,6 bei folgender Funktion:",
        "answers": [
          {
            "text": "C0",
            "comment": "Anweisungsüberdeckung (C0) wird erfüllt, da jede Anweisung durchlaufen wird."
          },
          {
            "text": "C1",
            "comment": "Zweigüberdeckung (C1) wird nicht erfüllt, da der Zweig i%2==0 && i%3!=0 nie durchlaufen wird."
          },
          {
            "text": "Einfache Bedingungsüberdeckung",
            "comment": "Einfache Bedingungsüberdeckung wird erfüllt, da jede Bedingung einmal zu true und ein anderes Mal zu false wird. "
          },
          {
            "text": "Bedingungs-/Entscheidungsüberdeckung",
            "comment": "Bedingungs-/Entscheidungsüberdeckung wird nicht erfüllt, da die Zweigüberdeckung (C1) ebenfalls nicht erfüllt wird und die Zweigüberdeckung ein Teil davon ist."
          },
          {
            "text": "Minimaler Mehrfach-Bedingungsüberdeckung",
            "comment": "Minimaler Mehrfach- Bedingungsüberdeckung wird erfüllt, weil jeder Teilausdruck einmal zu true und ein anderes Mal zu false wird."
          },
          {
            "text": "Mehrfach-Bedingungsüberdeckung",
            "comment": "Mehrfach-Bedingungsüberdeckung ist ebenfalls erfüllt, weil es keine komplexen Bedingungen gibt und die Einfache Bedingungsüberdeckung erfüllt ist. "
          },
          {
            "text": "Boundary Interior-Test",
            "comment": "Boundary Interior-Test ist erfüllt, da keine Schleifen vorhanden sind."
          },
          {
            "text": "Modifizierter Boundary Interior-Test",
            "comment": "Modifizierter Boundary Interior-Test ist nicht erfüllt, da die Zweigüberdeckung (C1) ebenfalls nicht erfüllt wird und die Zweigüberdeckung ein Teil davon ist."
          },
          {
            "text": "Pfadüberdeckung",
            "comment": "Pfadüberdeckung ist nicht erfüllt, da die Zweigüberdeckung (C1) ebenfalls nicht erfüllt wird und die Zweigüberdeckung ein Teil davon ist."
          }
        ],
        "correct": [ true, false, true, false, true, true, true, false, false ]
      }
    ]
  }
};