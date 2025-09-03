using System.Security.Cryptography;

namespace JEGASolutions.API.Utils;

public static class PasswordGenerator
{
    private const string LowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    private const string UppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string DigitChars = "0123456789";
    private const string SpecialChars = "!@#$%^&*";
    
    public static string GenerateTemporaryPassword(int length = 12)
    {
        if (length < 8)
            throw new ArgumentException("Password length must be at least 8 characters", nameof(length));

        var allChars = LowercaseChars + UppercaseChars + DigitChars + SpecialChars;
        var password = new char[length];
        
        // Ensure at least one character from each category
        password[0] = LowercaseChars[RandomNumberGenerator.GetInt32(LowercaseChars.Length)];
        password[1] = UppercaseChars[RandomNumberGenerator.GetInt32(UppercaseChars.Length)];
        password[2] = DigitChars[RandomNumberGenerator.GetInt32(DigitChars.Length)];
        password[3] = SpecialChars[RandomNumberGenerator.GetInt32(SpecialChars.Length)];
        
        // Fill the rest with random characters
        for (int i = 4; i < length; i++)
        {
            password[i] = allChars[RandomNumberGenerator.GetInt32(allChars.Length)];
        }
        
        // Shuffle the password array
        for (int i = 0; i < length; i++)
        {
            int randomIndex = RandomNumberGenerator.GetInt32(length);
            (password[i], password[randomIndex]) = (password[randomIndex], password[i]);
        }
        
        return new string(password);
    }
    
    public static string GenerateSubdomain(string baseName)
    {
        var cleanName = baseName.ToLower()
            .Replace(" ", "-")
            .Replace("@", "-")
            .Replace(".", "-")
            .Replace("_", "-");
        
        // Remove any non-alphanumeric characters except hyphens
        cleanName = System.Text.RegularExpressions.Regex.Replace(cleanName, @"[^a-z0-9\-]", "");
        
        // Remove multiple consecutive hyphens
        cleanName = System.Text.RegularExpressions.Regex.Replace(cleanName, @"-+", "-");
        
        // Remove leading/trailing hyphens
        cleanName = cleanName.Trim('-');
        
        // Ensure it's not empty and not too long
        if (string.IsNullOrEmpty(cleanName))
            cleanName = "cliente";
        
        if (cleanName.Length > 30)
            cleanName = cleanName.Substring(0, 30);
        
        // Add random suffix to ensure uniqueness
        var randomSuffix = RandomNumberGenerator.GetInt32(1000, 9999);
        return $"{cleanName}-{randomSuffix}";
    }
}
