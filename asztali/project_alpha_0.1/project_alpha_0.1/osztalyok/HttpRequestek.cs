using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using project_alpha_0._1.osztalyok;
using Org.BouncyCastle.Asn1.X509;
using System.Windows.Forms;

namespace project_alpha_0._1.osztalyok
{
    internal class HttpRequestek
    {
        HttpClient client = new HttpClient();

        public async Task<string> postLogin(string username, string password)
        {
            string url = "http://127.1.1.1:3000/loginAdmin";
            userData message = new userData();
            try
            {
                var JsonData = new
                {
                    loginUser = username,
                    loginPassword = password,
                    role = 2
                };
                string jsonString = JsonConvert.SerializeObject(JsonData);
                StringContent sendThis = new StringContent(jsonString, Encoding.UTF8, "Application/JSON");
                HttpResponseMessage response = await client.PostAsync(url, sendThis);

                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<userData>(result);
                TokenValasz.Token = message.token;
                MessageBox.Show(message.token);
                MessageBox.Show(TokenValasz.Token);
                MessageBox.Show(message.message);
                response.EnsureSuccessStatusCode();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", TokenValasz.Token);
                return "Sikeres bejelentkezés, shalom!";
            }
            catch (Exception e)
            {
                if (message == null)
                {
                    MessageBox.Show(e.Message);
                }
                else
                {
                    MessageBox.Show(message.message);
                }
                return "Hiba történt a bejelentkezés során!";
            }
            
        }
    }
}
