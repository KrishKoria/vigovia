FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates chromium
WORKDIR /root/

COPY --from=builder /app/main .
COPY --from=builder /app/config.yaml .
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/static ./static

RUN mkdir -p storage/pdfs

ENV SERVER_PORT=8080 \
    SERVER_HOST=0.0.0.0 \
    LOGGING_LEVEL=info \
    LOGGING_FORMAT=json

EXPOSE 8080
CMD ["./main"]