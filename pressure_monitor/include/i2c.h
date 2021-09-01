#pragma once
#include <stdio.h>

void i2c_init();
void i2c_destroy();

void i2c_write_byte(uint8_t data, uint16_t wait_ms);
void i2c_read_bytes(uint32_t *data, size_t size);