#include <stdio.h>

int main(void) {
  int a;
  int b = 0;
  printf("Enter a number: ");
  scanf("%d", &a);

  for (int i = 2; i <= a / 2; i++) {
    if (a % i == 0) {
      b = 1;
      break;
    }
  }

  if (b == 0) {
    printf("%d is a prime number", a);
  } else {
    printf("%d is not a prime number", a);
  }

  return 0;
}
