using System.Text.Json.Serialization;

namespace Cnh_rapida.DTOs;

public class VincularRequestDto
{
    [JsonPropertyName("identificador")]
    public string Identificador { get; set; } = string.Empty;
}
