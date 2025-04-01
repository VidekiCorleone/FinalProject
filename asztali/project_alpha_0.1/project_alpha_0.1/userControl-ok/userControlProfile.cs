using MySql.Data.MySqlClient;
using project_alpha_0._1.osztalyok;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1.userCoontrol_ok
{
    internal class userControlProfile : UserControl
    {
        public Label label1;
        public TextBox textBox1;
        public TextBox textBox2;
        public Label label2;
        public TextBox textBox3;
        public Label label3;
        public TextBox textBox4;
        private Panel panel1;
        private Button button3;
        private Button button2;
        private Button button1;
        public Label label5;
        public TextBox textBox5;
        public Label label4;

        public userControlProfile()
        {
            InitializeComponent();
            DatabaseManager();
            Start();
            button1.Click += EditBtn;
            button2.Click += SaveBtn;
            button3.Click += DeleteBtn; 
        }

        public void Start()
        {
            label1.Text = "Név: ";
            label1.BackColor = Color.FromArgb(169, 196, 108);
            label2.Text = "Felhasználónév: ";
            label2.BackColor = Color.FromArgb(169, 196, 108);
            label3.Text = "E-mail: ";
            label3.BackColor = Color.FromArgb(169, 196, 108);
            label4.Text = "Telefonszám: ";
            label4.BackColor = Color.FromArgb(169, 196, 108);
            label5.Text = "Jelszó: ";
            label5.BackColor = Color.FromArgb(169, 196, 108);

            button1.Text = "Módosítás";
            button2.Text = "Mentés";
            button3.Text = "Törlés";

            this.BackColor = Color.FromArgb(244, 255, 195);
            panel1.BackColor = Color.FromArgb(128, 157, 60);

            button2.Left = panel1.Width / 2 - button2.Width / 2;
            button1.Left = button2.Left - button1.Width - 10;
            button3.Left = button2.Left + button2.Width + 10;


            var userDataList = GetUserData();
            if (userDataList.Count > 0)
            {
                for (int i = 0; i < userDataList.Count; i++)
                {
                    var userData = userDataList[0];
                    textBox1.Text = userData.name;
                    textBox1.Enabled = false;
                    textBox2.Text = userData.username;
                    textBox2.Enabled = false;
                    textBox3.Text = userData.email;
                    textBox3.Enabled = false;
                    textBox4.Text = userData.phoneNumber.ToString();
                    textBox4.Enabled = false;
                    textBox5.Text = userData.password;
                    textBox5.Enabled = false;
                }
            }
        }

        public string connectionString;

        public void DatabaseManager()
        {
            connectionString = "server=localhost;database=parkhouse;user=root;password=;";
        }

        public List<userData> userDataList = new List<userData>();

        public async List<userData> GetUserData()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var response = await client.GetAsync("http://127.1.1.1:3000/profile");

                    if (response.IsSuccessStatusCode)
                    {
                        var json = await response.Content.ReadAsStringAsync();
                        userDataList = Newtonsoft.Json.JsonConvert.DeserializeObject<List<userData>>(json);
                    }
                    else
                    {
                        MessageBox.Show("Hiba történt az adatok lekérése során.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba: {ex.Message}");
                MessageBox.Show("Hiba történt az adatok lekérése során.");
            }

            return userDataList;
        }

        public void EditBtn(object sender, EventArgs e)
        {
            textBox1.Enabled = true;
            textBox2.Enabled = true;
            textBox3.Enabled = true;
            textBox4.Enabled = true;
            textBox5.Enabled = true;
        }

        public async void SaveBtn(object sender, EventArgs e)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var userData = new userData
                    {
                        name = textBox1.Text,
                        username = textBox2.Text,
                        email = textBox3.Text,
                        phoneNumber = int.Parse(textBox4.Text),
                        password = textBox5.Text
                    };

                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(userData);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var response = await client.PostAsync("http://127.1.1.1:3000/profileDataUpdate", content);

                    if (response.IsSuccessStatusCode)
                    {
                        // Disable textboxes after saving
                        textBox1.Enabled = false;
                        textBox2.Enabled = false;
                        textBox3.Enabled = false;
                        textBox4.Enabled = false;
                        textBox5.Enabled = false;

                        MessageBox.Show("Adatok sikeresen frissítve!");
                    }
                    else
                    {
                        MessageBox.Show("Hiba történt az adatok frissítése során.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba: {ex.Message}");
                MessageBox.Show("Hiba történt az adatok frissítése során.");
            }
        }

        public void DeleteBtn(object sender, EventArgs e)
        {

        }

        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.textBox2 = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textBox3 = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.textBox4 = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.button3 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.button1 = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.textBox5 = new System.Windows.Forms.TextBox();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.BackColor = System.Drawing.Color.Maroon;
            this.label1.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label1.Location = new System.Drawing.Point(15, 8);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(41, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "label1";
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(149, 6);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(133, 20);
            this.textBox1.TabIndex = 1;
            // 
            // textBox2
            // 
            this.textBox2.Location = new System.Drawing.Point(149, 32);
            this.textBox2.Name = "textBox2";
            this.textBox2.Size = new System.Drawing.Size(133, 20);
            this.textBox2.TabIndex = 3;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.BackColor = System.Drawing.Color.Maroon;
            this.label2.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label2.Location = new System.Drawing.Point(15, 34);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(41, 15);
            this.label2.TabIndex = 2;
            this.label2.Text = "label2";
            // 
            // textBox3
            // 
            this.textBox3.Location = new System.Drawing.Point(149, 58);
            this.textBox3.Name = "textBox3";
            this.textBox3.Size = new System.Drawing.Size(133, 20);
            this.textBox3.TabIndex = 5;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.BackColor = System.Drawing.Color.Maroon;
            this.label3.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label3.Location = new System.Drawing.Point(15, 60);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(41, 15);
            this.label3.TabIndex = 4;
            this.label3.Text = "label3";
            // 
            // textBox4
            // 
            this.textBox4.Location = new System.Drawing.Point(149, 84);
            this.textBox4.Name = "textBox4";
            this.textBox4.Size = new System.Drawing.Size(133, 20);
            this.textBox4.TabIndex = 7;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.BackColor = System.Drawing.Color.Maroon;
            this.label4.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label4.Location = new System.Drawing.Point(15, 86);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(41, 15);
            this.label4.TabIndex = 6;
            this.label4.Text = "label4";
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.Maroon;
            this.panel1.Controls.Add(this.label5);
            this.panel1.Controls.Add(this.textBox5);
            this.panel1.Controls.Add(this.button3);
            this.panel1.Controls.Add(this.button2);
            this.panel1.Controls.Add(this.button1);
            this.panel1.Controls.Add(this.label4);
            this.panel1.Controls.Add(this.textBox4);
            this.panel1.Controls.Add(this.label3);
            this.panel1.Controls.Add(this.label2);
            this.panel1.Controls.Add(this.textBox3);
            this.panel1.Controls.Add(this.label1);
            this.panel1.Controls.Add(this.textBox1);
            this.panel1.Controls.Add(this.textBox2);
            this.panel1.Location = new System.Drawing.Point(3, 3);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(294, 169);
            this.panel1.TabIndex = 8;
            // 
            // button3
            // 
            this.button3.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.button3.Location = new System.Drawing.Point(207, 138);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(75, 23);
            this.button3.TabIndex = 10;
            this.button3.Text = "button3";
            this.button3.UseVisualStyleBackColor = true;
            // 
            // button2
            // 
            this.button2.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.button2.Location = new System.Drawing.Point(111, 138);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(75, 23);
            this.button2.TabIndex = 9;
            this.button2.Text = "button2";
            this.button2.UseVisualStyleBackColor = true;
            // 
            // button1
            // 
            this.button1.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.button1.Location = new System.Drawing.Point(18, 138);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 8;
            this.button1.Text = "button1";
            this.button1.UseVisualStyleBackColor = true;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.BackColor = System.Drawing.Color.Maroon;
            this.label5.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label5.Location = new System.Drawing.Point(15, 112);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(41, 15);
            this.label5.TabIndex = 11;
            this.label5.Text = "label5";
            // 
            // textBox5
            // 
            this.textBox5.Location = new System.Drawing.Point(149, 110);
            this.textBox5.Name = "textBox5";
            this.textBox5.Size = new System.Drawing.Size(133, 20);
            this.textBox5.TabIndex = 12;
            // 
            // userControlProfile
            // 
            this.BackColor = System.Drawing.Color.Black;
            this.Controls.Add(this.panel1);
            this.Name = "userControlProfile";
            this.Size = new System.Drawing.Size(300, 175);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);

        }
    }
}
