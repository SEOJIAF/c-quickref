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
  "Pointers", "Memory", "Structs", "Preprocessor", "Files", "Gotchas",
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
    tags: ["sort", "qsort", "order", "compare", "callback", "array", "ascending"],
    aka: "how to sort an array of ints",
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
    code: c`int add(int a, int b) {
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
    aka: "how to allocate memory dynamically",
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
];
